import { beforeAll, afterAll, describe, expect, test } from 'vitest'
import crypto from 'crypto'
import { prisma } from '../../config/db.js'
import { register, login, refresh } from './auth.service.js'
import { AppError } from '../../middleware/AppError.js'

const testEmail = 'testuser@inventory.com'
const testPassword = 'Password@123'

beforeAll(async () => {
  await prisma.refreshToken.deleteMany({ where: { user: { email: testEmail } } })
  await prisma.user.deleteMany({ where: { email: testEmail } })
  await register('Test User', testEmail, testPassword)
})

afterAll(async () => {
  await prisma.refreshToken.deleteMany({ where: { user: { email: testEmail } } })
  await prisma.user.deleteMany({ where: { email: testEmail } })
  await prisma.$disconnect()
})

describe('auth.service', () => {
  test('login with correct credentials returns tokens', async () => {
    const result = await login(testEmail, testPassword)
    expect(result.accessToken).toBeTruthy()
    expect(result.refreshToken).toBeTruthy()
    expect(result.user.email).toBe(testEmail)
  })

  test('login with wrong password increments failedLoginAttempts', async () => {
    const before = await prisma.user.findUnique({ where: { email: testEmail } })
    await expect(login(testEmail, 'WrongPass1')).rejects.toBeInstanceOf(AppError)
    const after = await prisma.user.findUnique({ where: { email: testEmail } })
    expect(after?.failedLoginAttempts).toBe((before?.failedLoginAttempts ?? 0) + 1)
  })

  test('login when account locked throws AUTH_ACCOUNT_LOCKED', async () => {
    await prisma.user.update({ where: { email: testEmail }, data: { lockedUntil: new Date(Date.now() + 10000) } })
    await expect(login(testEmail, testPassword)).rejects.toMatchObject({ code: 'AUTH_ACCOUNT_LOCKED' })
    await prisma.user.update({ where: { email: testEmail }, data: { lockedUntil: null, failedLoginAttempts: 0 } })
  })

  test('refresh with valid token returns new tokens and revokes old token', async () => {
    const loginResult = await login(testEmail, testPassword)
    const refreshResult = await refresh(loginResult.refreshToken)
    expect(refreshResult.accessToken).toBeTruthy()
    expect(refreshResult.refreshToken).toBeTruthy()

    const oldHash = crypto.createHash('sha256').update(loginResult.refreshToken).digest('hex')
    const oldRecord = await prisma.refreshToken.findUnique({ where: { tokenHash: oldHash } })
    expect(oldRecord?.revokedAt).toBeTruthy()
  })

  test('refresh with already-revoked token throws AUTH_TOKEN_REVOKED', async () => {
    const loginResult = await login(testEmail, testPassword)
    await refresh(loginResult.refreshToken)
    await expect(refresh(loginResult.refreshToken)).rejects.toMatchObject({ code: 'AUTH_TOKEN_REVOKED' })
  })
})
