type LogLevel = 'debug' | 'info' | 'warn' | 'error'

type LogContext = Record<string, unknown>

const REDACTED = '[redacted]'
const SENSITIVE_KEY_PATTERN = /(password|secret|token|authorization|cookie|session|key)/i

function normalizeError(error: unknown) {
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      stack: process.env.NODE_ENV === 'production' ? undefined : error.stack,
    }
  }

  return error
}

function sanitize(value: unknown): unknown {
  if (value instanceof Error) return normalizeError(value)
  if (Array.isArray(value)) return value.map(sanitize)
  if (!value || typeof value !== 'object') return value

  return Object.fromEntries(
    Object.entries(value).map(([key, entry]) => [
      key,
      SENSITIVE_KEY_PATTERN.test(key) ? REDACTED : sanitize(entry),
    ])
  )
}

function write(level: LogLevel, scope: string, message: string, context: LogContext = {}) {
  const sanitizedContext = sanitize(context) as LogContext
  const payload = {
    level,
    scope,
    message,
    ...sanitizedContext,
  }

  if (level === 'error') {
    console.error(payload)
    return
  }

  if (level === 'warn') {
    console.warn(payload)
    return
  }

  if (level === 'debug') {
    console.debug(payload)
    return
  }

  console.info(payload)
}

export const logger = {
  debug: (scope: string, message: string, context?: LogContext) =>
    write('debug', scope, message, context),
  info: (scope: string, message: string, context?: LogContext) =>
    write('info', scope, message, context),
  warn: (scope: string, message: string, context?: LogContext) =>
    write('warn', scope, message, context),
  error: (scope: string, message: string, context?: LogContext) =>
    write('error', scope, message, context),
}
