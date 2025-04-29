import { NextResponse } from 'next/server'

type ErrorDetails = {
  code?: string
  target?: string
  source?: string
  meta?: Record<string, any>
}

export class ApiError extends Error {
  statusCode: number
  details?: ErrorDetails
  
  constructor(message: string, statusCode: number = 500, details?: ErrorDetails) {
    super(message)
    this.name = 'ApiError'
    this.statusCode = statusCode
    this.details = details
  }
  
  static badRequest(message: string = 'Bad Request', details?: ErrorDetails) {
    return new ApiError(message, 400, details)
  }
  
  static unauthorized(message: string = 'Unauthorized', details?: ErrorDetails) {
    return new ApiError(message, 401, details)
  }
  
  static forbidden(message: string = 'Forbidden', details?: ErrorDetails) {
    return new ApiError(message, 403, details)
  }
  
  static notFound(message: string = 'Not Found', details?: ErrorDetails) {
    return new ApiError(message, 404, details)
  }
  
  static methodNotAllowed(message: string = 'Method Not Allowed', details?: ErrorDetails) {
    return new ApiError(message, 405, details)
  }
  
  static tooManyRequests(message: string = 'Too Many Requests', details?: ErrorDetails) {
    return new ApiError(message, 429, details)
  }
  
  static internal(message: string = 'Internal Server Error', details?: ErrorDetails) {
    return new ApiError(message, 500, details)
  }
  
  static fromError(error: any): ApiError {
    // Postgres errors from Supabase
    if (error?.code === 'PGRST116') {
      return ApiError.notFound('Resource not found')
    }
    
    if (error?.code === '23505') {
      return ApiError.badRequest('Duplicate entry', { code: error.code })
    }
    
    if (error?.code?.startsWith('22')) {
      return ApiError.badRequest('Invalid input syntax', { code: error.code })
    }
    
    if (error?.code?.startsWith('23')) {
      return ApiError.badRequest('Constraint violation', { code: error.code })
    }
    
    // Auth errors from Supabase
    if (error?.status === 401) {
      return ApiError.unauthorized(error.message || 'Authentication failed')
    }
    
    if (error?.status === 403) {
      return ApiError.forbidden(error.message || 'Permission denied')
    }
    
    // Return a generic internal server error for unhandled cases
    return ApiError.internal()
  }
  
  toResponse() {
    const body = {
      error: {
        message: this.message,
        statusCode: this.statusCode,
        ...(this.details && { details: this.details }),
      },
    }
    
    return NextResponse.json(body, { status: this.statusCode })
  }
}

// Handler to wrap API routes with common error handling
export function withErrorHandling(handler: Function) {
  return async (...args: any[]) => {
    try {
      return await handler(...args)
    } catch (error) {
      console.error('API Error:', error)
      
      if (error instanceof ApiError) {
        return error.toResponse()
      }
      
      return ApiError.fromError(error).toResponse()
    }
  }
}
