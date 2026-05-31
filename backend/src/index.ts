/**
 * 后端服务入口文件
 * 创建 Express 应用，注册中间件和路由，启动 HTTP 服务
 * 同时提供前端静态文件服务和数据 API 接口
 */

import express from 'express';
import path from 'path';
import helmet from 'helmet';
import { getConfig } from './config';
import { loggerMiddleware } from './middleware/logger';
import { corsMiddleware } from './middleware/cors';
import { notFoundHandler, globalErrorHandler } from './middleware/errorHandler';
import apiRouter from './routes/api';
import { DataService } from './services/dataService';
import { initDataController } from './controllers/dataController';

/** 获取配置 */
const config = getConfig();

/** 创建 Express 应用 */
const app = express();

/** ============================================
 *  中间件注册（按执行顺序排列）
 *  ============================================ */

// 1. 安全相关中间件（设置 HTTP 安全头）
app.use(helmet({
  contentSecurityPolicy: false, // 静态站点暂不启用 CSP
}));

// 2. CORS 跨域中间件
app.use(corsMiddleware(config.corsOrigin));

// 3. 请求日志中间件
app.use(loggerMiddleware(config.nodeEnv));

// 4. 请求体解析（预留，当前项目主要为 GET 请求）
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/** ============================================
 *  路由注册
 *  ============================================ */

// 初始化数据服务
const dataService = new DataService(path.resolve(config.dataDir));
initDataController(dataService);

// API 路由（挂载到 /api 前缀）
app.use(config.apiPrefix, apiRouter);

/** ============================================
 *  静态文件服务（必须在 API 路由之后注册）
 *  ============================================ */

const staticPath = path.resolve(config.staticDir);

// 静态资源（带缓存）
app.use('/assets', express.static(path.join(staticPath, 'assets'), {
  maxAge: config.staticCacheMaxAge * 1000, // 转换为毫秒
  immutable: config.nodeEnv === 'production',
}));

// 其他静态文件
app.use(express.static(staticPath, {
  maxAge: config.staticCacheMaxAge * 1000,
  immutable: config.nodeEnv === 'production',
}));

/** ============================================
 *  前端路由兜底（SPA 支持）
 *  对于非 API、非静态资源的请求，返回 index.html
 *  ============================================ */

app.get('*', (_req, res) => {
  const indexPath = path.join(staticPath, 'index.html');
  if (require('fs').existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).json({
      success: false,
      error: {
        code: 404,
        message: '前端资源未构建，请先执行前端构建命令: cd frontend && npm run build',
      },
    });
  }
});

/** ============================================
 *  错误处理中间件（必须最后注册）
 *  ============================================ */

// 404 处理器（理论上不会触发，因为上面的 * 兜底了）
app.use(notFoundHandler);

// 全局错误处理
app.use(globalErrorHandler);

/** ============================================
 *  启动服务
 *  ============================================ */

const server = app.listen(config.port, () => {
  console.log('');
  console.log('🎭 ═══════════════════════════════════════════');
  console.log('🎭   秦腔文化科普网站 - 后端服务已启动');
  console.log('🎭 ═══════════════════════════════════════════');
  console.log(`🎭   环境:    ${config.nodeEnv}`);
  console.log(`🎭   地址:    http://localhost:${config.port}`);
  console.log(`🎭   API:     http://localhost:${config.port}/api/health`);
  console.log(`🎭   静态目录: ${staticPath}`);
  console.log(`🎭   数据目录: ${path.resolve(config.dataDir)}`);
  console.log('🎭 ═══════════════════════════════════════════');
  console.log('');
});

/** 优雅关闭 */
const gracefulShutdown = (signal: string) => {
  console.log(`\n收到 ${signal} 信号，正在优雅关闭服务...`);
  server.close(() => {
    console.log('✅ 服务已安全关闭');
    process.exit(0);
  });

  // 强制退出超时
  setTimeout(() => {
    console.error('⚠️ 强制关闭服务（超时）');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

export default server;
