import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import { OAuth2Client } from 'google-auth-library'
import { prisma } from '../../config/db.js'
import { config } from '../../config/env.js'
import { AppError } from '../../middleware/AppError.js'

const hashRefreshToken = (token: string): string => {
  return crypto.createHash('sha256').update(token).digest('hex')
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

export interface AuthUser {
  id: string
  email: string
  name: string
  role: string
}

export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, config.BCRYPT_ROUNDS)
}

export const verifyPassword = async (password: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(password, hash)
}

export const generateAccessToken = (sub: string, role: string): string => {
  return jwt.sign({ sub, role }, config.JWT_ACCESS_SECRET, { expiresIn: config.JWT_ACCESS_EXPIRY })
}

const parseRefreshExpiry = (raw: string): number => {
  if (raw.endsWith('d')) {
    return Number(raw.slice(0, -1)) * 24 * 60 * 60 * 1000
  }
  return Number(raw) * 1000
}

export const generateRefreshToken = async (userId: string, role: string): Promise<AuthTokens> => {
  const refreshToken = crypto.randomBytes(64).toString('hex')
  const tokenHash = hashRefreshToken(refreshToken)
  const expiresAt = new Date(Date.now() + parseRefreshExpiry(config.JWT_REFRESH_EXPIRY))
  await prisma.refreshToken.create({
    data: {
      userId,
      tokenHash,
      expiresAt
    }
  })
  return {
    accessToken: generateAccessToken(userId, role),
    refreshToken
  }
}

const googleClient = new OAuth2Client(config.GOOGLE_CLIENT_ID)

const getGooglePayload = async (credential: string) => {
  if (!config.GOOGLE_CLIENT_ID) {
    throw new AppError('AUTH_GOOGLE_CONFIG_MISSING', 500, 'Google sign-in is not configured')
  }

  const ticket = await googleClient.verifyIdToken({
    idToken: credential,
    audience: config.GOOGLE_CLIENT_ID
  })

  const payload = ticket.getPayload()
  if (!payload?.email || !payload?.name) {
    throw new AppError('AUTH_GOOGLE_PAYLOAD_INVALID', 400, 'Google token did not contain required user information')
  }

  return {
    email: payload.email,
    name: payload.name
  }
}

export const signInWithGoogle = async (credential: string): Promise<{ user: AuthUser; accessToken: string; refreshToken: string }> => {
  const { email, name } = await getGooglePayload(credential)
  let user = await prisma.user.findUnique({ where: { email } })

  if (!user) {
    const passwordHash = await hashPassword(crypto.randomBytes(64).toString('hex'))
    user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        role: 'STAFF'
      }
    })
  }

  if (!user.isActive) {
    throw new AppError('AUTH_ACCOUNT_LOCKED', 403, 'Account is inactive')
  }

  const tokens = await generateRefreshToken(user.id, user.role)

  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    },
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken
  }
}

export const register = async (name: string, email: string, password: string): Promise<{ user: AuthUser; accessToken: string; refreshToken: string }> => {
  const normalizedEmail = email.trim().toLowerCase()
  const existing = await prisma.user.findUnique({ where: { email: normalizedEmail } })

  if (existing) {
    throw new AppError('AUTH_EMAIL_IN_USE', 409, 'Email is already registered')
  }

  const passwordHash = await hashPassword(password)
  const user = await prisma.user.create({
    data: {
      name,
      email: normalizedEmail,
      passwordHash,
      role: 'STAFF'
    }
  })

  const tokens = await generateRefreshToken(user.id, user.role)

  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    },
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken
  }
}

export const login = async (email: string, password: string): Promise<{ user: AuthUser; accessToken: string; refreshToken: string }> => {
  const normalizedEmail = email.trim().toLowerCase()
  const user = await prisma.user.findUnique({ where: { email: normalizedEmail } })

  if (!user) {
    throw new AppError('AUTH_INVALID_CREDENTIALS', 401, 'Invalid email or password')
  }

  if (!user.isActive) {
    throw new AppError('AUTH_ACCOUNT_LOCKED', 403, 'Account is inactive')
  }

  if (user.lockedUntil && user.lockedUntil > new Date()) {
    throw new AppError('AUTH_ACCOUNT_LOCKED', 403, 'Account is locked')
  }

  const isValid = await verifyPassword(password, user.passwordHash)

  if (!isValid) {
    const updateData: { failedLoginAttempts: number; lockedUntil?: Date | null } = {
      failedLoginAttempts: user.failedLoginAttempts + 1
    }

    if (updateData.failedLoginAttempts >= 5) {
      updateData.lockedUntil = new Date(Date.now() + 15 * 60 * 1000)
    }

    await prisma.user.update({ where: { id: user.id }, data: updateData })
    throw new AppError('AUTH_INVALID_CREDENTIALS', 401, 'Invalid email or password')
  }

  await prisma.user.update({ where: { id: user.id }, data: { failedLoginAttempts: 0, lockedUntil: null } })

  const tokenData = await generateRefreshToken(user.id, user.role)

  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    },
    accessToken: tokenData.accessToken,
    refreshToken: tokenData.refreshToken
  }
}

export const refresh = async (refreshToken: string): Promise<AuthTokens> => {
  const tokenHash = hashRefreshToken(refreshToken)
  const record = await prisma.refreshToken.findUnique({ where: { tokenHash } })

  if (!record) {
    throw new AppError('AUTH_TOKEN_INVALID', 401, 'Refresh token is invalid')
  }

  if (record.revokedAt) {
    throw new AppError('AUTH_TOKEN_REVOKED', 401, 'Refresh token has been revoked')
  }

  if (record.expiresAt < new Date()) {
    throw new AppError('AUTH_TOKEN_EXPIRED', 401, 'Refresh token expired')
  }

  await prisma.refreshToken.update({ where: { id: record.id }, data: { revokedAt: new Date() } })
  const user = await prisma.user.findUnique({ where: { id: record.userId } })

  if (!user) {
    throw new AppError('AUTH_INVALID_CREDENTIALS', 401, 'Invalid refresh token')
  }

  const newTokens = await generateRefreshToken(user.id, user.role)
  return newTokens
}

export const logout = async (refreshToken: string): Promise<void> => {
  const tokenHash = hashRefreshToken(refreshToken)
  const record = await prisma.refreshToken.findUnique({ where: { tokenHash } })

  if (!record) {
    return
  }

  await prisma.refreshToken.update({ where: { id: record.id }, data: { revokedAt: new Date() } })
}
