/**
 * 数据加载工具
 * 封装从 public/assets/data/ 目录异步加载 JSON 数据的函数
 * 带类型定义和错误处理
 * 在 Astro 中也可以直接 import JSON 文件（构建时注入）
 */

import type {
  HistoryEvent,
  RoleCategory,
  CostumeMakeup,
  ArtistPlay,
  MediaResource,
} from '../types/index';

/** 数据文件路径映射 */
const DATA_PATHS = {
  history: '/assets/data/history.json',
  roles: '/assets/data/roles.json',
  costumesMakeup: '/assets/data/costumes-makeup.json',
  artistsPlays: '/assets/data/artists-plays.json',
  media: '/assets/data/media.json',
} as const;

/** 数据类型映射 */
type DataTypeMap = {
  history: HistoryEvent[];
  roles: RoleCategory[];
  costumesMakeup: CostumeMakeup[];
  artistsPlays: ArtistPlay[];
  media: MediaResource[];
};

/** 数据键类型 */
type DataKey = keyof typeof DATA_PATHS;

/** 缓存已加载的数据 */
const dataCache = new Map<string, unknown>();

/**
 * 异步加载指定模块的 JSON 数据
 * @param key - 数据模块名称
 * @returns 解析后的数据数组
 */
export async function loadData<K extends DataKey>(key: K): Promise<DataTypeMap[K]> {
  // 检查缓存
  if (dataCache.has(key)) {
    return dataCache.get(key) as DataTypeMap[K];
  }

  const url = DATA_PATHS[key];

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`数据加载失败: ${response.status} ${response.statusText} (${url})`);
    }

    const data = (await response.json()) as DataTypeMap[K];

    // 写入缓存
    dataCache.set(key, data);

    return data;
  } catch (error) {
    console.error(`加载 ${key} 数据时出错:`, error);
    throw error;
  }
}

/**
 * 同步加载 JSON 数据（Astro 构建时使用）
 * 直接 import JSON 文件，在构建时被 Astro 内联
 */
export async function loadDataStatic<K extends DataKey>(key: K): Promise<DataTypeMap[K]> {
  const importMap: Record<DataKey, () => Promise<unknown>> = {
    history: () => import('../../public/assets/data/history.json'),
    roles: () => import('../../public/assets/data/roles.json'),
    costumesMakeup: () => import('../../public/assets/data/costumes-makeup.json'),
    artistsPlays: () => import('../../public/assets/data/artists-plays.json'),
    media: () => import('../../public/assets/data/media.json'),
  };

  const mod = (await importMap[key]()) as { default: DataTypeMap[K] };
  return mod.default;
}

/**
 * 清除数据缓存
 */
export function clearDataCache(): void {
  dataCache.clear();
}

export default {
  loadData,
  loadDataStatic,
  clearDataCache,
};
