/**
 * CORS 跨域中间件配置
 * 为本地开发和 API 调用提供跨域支持
 */

import cors from 'cors';
import { CorsOptions } from 'cors';

/**
 * 创建 CORS 配置中间件
 * @param allowedOrigin - 允许的来源域名
 */
export const corsMiddleware = (allowedOrigin: string): ReturnType<typeof cors> => {
  const options: CorsOptions = {
    // 允许的来源
    origin: allowedOrigin === '*' ? true : allowedOrigin.split(','),
    // 允许的 HTTP 方法
    methods: ['GET', 'HEAD', 'OPTIONS'],
    // 允许的请求头
    allowedHeaders: ['Content-Type', 'Accept', 'Authorization'],
    // 预检请求缓存时间（秒）
    maxAge: 86400,
    // 不携带凭证（纯静态站点无需认证）
    credentials: false,
  };

  return cors(options);
};

export default corsMiddleware;
