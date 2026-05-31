/**
 * 健康检查控制器
 * 提供服务健康状态和运行信息的 API
 */

import { Request, Response } from 'express';

/** 服务启动时间 */
const serverStartTime = new Date();

/**
 * GET /api/health
 * 健康检查接口
 */
export const healthCheck = (_req: Request, res: Response): void => {
  const uptimeSeconds = process.uptime();
  const memoryUsage = process.memoryUsage();

  res.json({
    success: true,
    data: {
      status: 'healthy',
      service: 'qinqiang-culture-backend',
      version: '1.0.0',
      uptime: {
        seconds: Math.floor(uptimeSeconds),
        formatted: formatUptime(uptimeSeconds),
      },
      memory: {
        rss: `${Math.round(memoryUsage.rss / 1024 / 1024)}MB`,
        heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)}MB`,
        heapTotal: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)}MB`,
      },
      startedAt: serverStartTime.toISOString(),
      timestamp: new Date().toISOString(),
    },
  });
};

/**
 * 格式化运行时间
 */
function formatUptime(seconds: number): string {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  const parts: string[] = [];
  if (days > 0) parts.push(`${days}天`);
  if (hours > 0) parts.push(`${hours}小时`);
  if (minutes > 0) parts.push(`${minutes}分钟`);
  parts.push(`${secs}秒`);

  return parts.join(' ');
}

export default healthCheck;
