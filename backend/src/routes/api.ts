/**
 * API 路由定义
 * 将 URL 路径映射到对应的控制器方法
 * 所有数据接口均以 /api 为前缀
 */

import { Router } from 'express';
import { healthCheck } from '../controllers/healthController';
import * as dataController from '../controllers/dataController';

/** 创建路由器实例 */
const router = Router();

/**
 * 健康检查路由
 * GET /api/health
 * 无需认证，返回服务运行状态
 */
router.get('/health', healthCheck);

/**
 * 数据查询路由组
 * GET /api/data/history         - 获取历史事件列表
 * GET /api/data/roles           - 获取行当分类列表
 * GET /api/data/costumes-makeup - 获取脸谱服饰列表
 * GET /api/data/artists-plays   - 获取名家剧目列表
 * GET /api/data/media           - 获取媒体资源列表
 * GET /api/data/all             - 获取全部数据汇总
 */
router.get('/data/history', dataController.getHistory);
router.get('/data/roles', dataController.getRoles);
router.get('/data/costumes-makeup', dataController.getCostumesMakeup);
router.get('/data/artists-plays', dataController.getArtistsPlays);
router.get('/data/media', dataController.getMedia);
router.get('/data/all', dataController.getAllData);

export default router;
