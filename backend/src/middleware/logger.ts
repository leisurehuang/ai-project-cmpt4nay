/**
 * 日志中间件
 * 基于morgan封装，根据环境自动切换日志格式
 * 开发环境：彩色简洁输出
 * 生产环境：Apache联合日志格式
 */

import morgan from 'morgan';
import { Request, Response, NextFunction } from 'express';

/** 自定义Token：记录响应体大小 */
morgan.token('res-size', (req: Request, res: Response) => {
  const size = res.get('Content-Length');
  return size ? `${size}B` : '-';
});

/**
 * 获取日志中间件
 * @param nodeEnv - 当前运行环境
 */
export const loggerMiddleware = (nodeEnv: string) => {
  // 开发环境使用 dev 格式（彩色简洁输出）
  if (nodeEnv === 'development') {
    return morgan('dev');
  }
  // 生产环境使用 combined 格式（完整日志）
  return morgan('combined');
};

export default loggerMiddleware;
