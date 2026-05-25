import { type Request, type Response, type NextFunction } from 'express'
import type { AuthRequest } from '../../middleware/auth.js'
import { login, logout, refresh, register, signInWithGoogle } from './auth.service.js'

export const registerController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, email, password } = req.body
    const result = await register(name, email, password)
    res.status(201).json({ success: true, data: result })
  } catch (error) {
    next(error)
  }
}

export const loginController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password } = req.body
    const result = await login(email, password)
    res.json({ success: true, data: result })
  } catch (error) {
    next(error)
  }
}

export const googleAuthController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { credential } = req.body
    const result = await signInWithGoogle(credential)
    res.json({ success: true, data: result })
  } catch (error) {
    next(error)
  }
}

export const refreshController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { refreshToken } = req.body
    const result = await refresh(refreshToken)
    res.json({ success: true, data: result })
  } catch (error) {
    next(error)
  }
}

export const logoutController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { refreshToken } = req.body
    await logout(refreshToken)
    res.json({ success: true, data: { loggedOut: true } })
  } catch (error) {
    next(error)
  }
}

export const meController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authReq = req as unknown as AuthRequest
    res.json({ success: true, data: { user: authReq.user } })
  } catch (error) {
    next(error)
  }
}
