/**
 * 全局错误处理中间件
 * 捕获所有未处理的错误，返回统一格式的错误响应
 */

import { Request, Response, NextFunction } from 'express';

/** 自定义应用错误类 */
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(statusCode: number, message: string, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

/** 扩展 Express Request 类型，附带请求时间戳 */
declare global {
  namespace Express {
    interface Request {
      startTime?: number;
    }
  }
}

/**
 * 404 未找到资源处理中间件
 */
export const notFoundHandler = (req: Request, res: Response, _next: NextFunction): void => {
  res.status(404).json({
    success: false,
    error: {
      code: 404,
      message: `请求的资源未找到: ${req.method} ${req.originalUrl}`,
    },
    timestamp: new Date().toISOString(),
  });
};

/**
 * 全局错误处理中间件（必须放在所有路由之后）
 */
export const globalErrorHandler = (
  err: Error | AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  // 如果是自定义的应用错误
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      error: {
        code: err.statusCode,
        message: err.message,
      },
      timestamp: new Date().toISOString(),
    });
    return;
  }

  // 未知服务器错误
  console.error('💥 未预期的服务器错误:', err);
  res.status(500).json({
    success: false,
    error: {
      code: 500,
      message: '服务器内部错误，请稍后重试',
    },
    timestamp: new Date().toISOString(),
  });
};

export default globalErrorHandler;
