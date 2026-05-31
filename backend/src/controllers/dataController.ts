/**
 * 数据控制器
 * 处理所有数据 API 请求，返回结构化的 JSON 响应
 * 每个控制器方法对应一个数据模块的读取操作
 */

import { Request, Response } from 'express';
import { DataService } from '../services/dataService';
import { AppError } from '../middleware/errorHandler';

/** 数据服务实例（在路由初始化时注入） */
let dataService: DataService;

/**
 * 初始化数据控制器
 * @param service - 数据服务实例
 */
export const initDataController = (service: DataService): void => {
  dataService = service;
};

/** 统一成功响应格式 */
interface ApiResponse<T> {
  success: boolean;
  data: T;
  count: number;
  timestamp: string;
}

/** 构建成功响应 */
function buildResponse<T>(data: T): ApiResponse<T> {
  return {
    success: true,
    data,
    count: Array.isArray(data) ? data.length : 1,
    timestamp: new Date().toISOString(),
  };
}

/**
 * GET /api/data/history
 * 获取历史事件列表
 */
export const getHistory = (_req: Request, res: Response): void => {
  try {
    const data = dataService.getHistory();
    res.json(buildResponse(data));
  } catch (error) {
    throw new AppError(500, `读取历史数据失败: ${(error as Error).message}`);
  }
};

/**
 * GET /api/data/roles
 * 获取行当分类列表
 */
export const getRoles = (_req: Request, res: Response): void => {
  try {
    const data = dataService.getRoles();
    res.json(buildResponse(data));
  } catch (error) {
    throw new AppError(500, `读取行当数据失败: ${(error as Error).message}`);
  }
};

/**
 * GET /api/data/costumes-makeup
 * 获取脸谱服饰列表
 */
export const getCostumesMakeup = (_req: Request, res: Response): void => {
  try {
    const data = dataService.getCostumesMakeup();
    res.json(buildResponse(data));
  } catch (error) {
    throw new AppError(500, `读取脸谱服饰数据失败: ${(error as Error).message}`);
  }
};

/**
 * GET /api/data/artists-plays
 * 获取名家剧目列表
 */
export const getArtistsPlays = (_req: Request, res: Response): void => {
  try {
    const data = dataService.getArtistsPlays();
    res.json(buildResponse(data));
  } catch (error) {
    throw new AppError(500, `读取名家剧目数据失败: ${(error as Error).message}`);
  }
};

/**
 * GET /api/data/media
 * 获取媒体资源列表
 */
export const getMedia = (_req: Request, res: Response): void => {
  try {
    const data = dataService.getMedia();
    res.json(buildResponse(data));
  } catch (error) {
    throw new AppError(500, `读取媒体资源数据失败: ${(error as Error).message}`);
  }
};

/**
 * GET /api/data/all
 * 获取全部数据（汇总）
 */
export const getAllData = (_req: Request, res: Response): void => {
  try {
    const data = dataService.getAllData();
    res.json({
      success: true,
      data,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    throw new AppError(500, `读取全部数据失败: ${(error as Error).message}`);
  }
};

export default {
  initDataController,
  getHistory,
  getRoles,
  getCostumesMakeup,
  getArtistsPlays,
  getMedia,
  getAllData,
};
