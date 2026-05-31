/**
 * 后端服务配置文件
 * 集中管理所有可配置项，支持通过环境变量覆盖默认值
 */

/** 环境配置接口 */
export interface ServerConfig {
  /** 服务端口 */
  port: number;
  /** 运行环境 */
  nodeEnv: 'development' | 'production';
  /** 前端静态文件目录（Astro 构建输出目录） */
  staticDir: string;
  /** 数据文件目录（JSON 数据源） */
  dataDir: string;
  /** API 路由前缀 */
  apiPrefix: string;
  /** CORS 允许的来源 */
  corsOrigin: string;
  /** 静态资源缓存时间（秒） */
  staticCacheMaxAge: number;
}

/** 获取配置 */
export const getConfig = (): ServerConfig => {
  const nodeEnv = (process.env.NODE_ENV || 'development') as 'development' | 'production';

  return {
    port: parseInt(process.env.PORT || '3000', 10),
    nodeEnv,
    // 静态文件目录指向前端 Astro 构建输出
    staticDir: process.env.STATIC_DIR || '../frontend/dist',
    // 数据文件目录指向前端 JSON 数据源
    dataDir: process.env.DATA_DIR || '../frontend/public/assets/data',
    apiPrefix: '/api',
    corsOrigin: process.env.CORS_ORIGIN || '*',
    // 生产环境缓存 7 天，开发环境不缓存
    staticCacheMaxAge: nodeEnv === 'production' ? 604800 : 0,
  };
};

export default getConfig;
