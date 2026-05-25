export class AppError extends Error {
  public readonly code: string
  public readonly statusCode: number
  public readonly details?: unknown

  public constructor(code: string, statusCode: number, message: string, details?: unknown) {
    super(message)
    this.code = code
    this.statusCode = statusCode
    this.details = details
    Object.setPrototypeOf(this, AppError.prototype)
  }
}
