/**
 * 数据服务层
 * 负责从本地 JSON 文件读取结构化数据
 * 提供缓存机制，避免重复磁盘 I/O
 */

import fs from 'fs';
import path from 'path';

/** 数据类型映射：文件名到数据类型 */
interface DataFileMap {
  'history': HistoryEventItem[];
  'roles': RoleCategoryItem[];
  'costumes-makeup': CostumeMakeupItem[];
  'artists-plays': ArtistPlayItem[];
  'media': MediaResourceItem[];
}

/** 历史事件 */
interface HistoryEventItem {
  id: string;
  year: string;
  title: string;
  description: string;
  imageUrl?: string;
}

/** 行当分类 */
interface RoleCategoryItem {
  id: string;
  name: string;
  icon: string;
  features: string;
  representativeFigures: string;
}

/** 脸谱服饰 */
interface CostumeMakeupItem {
  id: string;
  title: string;
  category: string;
  colorMeaning?: string;
  imageUrl: string;
}

/** 名家剧目 */
interface ArtistPlayItem {
  id: string;
  artistName: string;
  playTitle: string;
  synopsis: string;
  mediaUrl?: string;
}

/** 媒体资源 */
interface MediaResourceItem {
  id: string;
  title: string;
  type: string;
  source: string;
  url: string;
  coverUrl?: string;
  description: string;
}

/** 内存缓存 */
const dataCache = new Map<string, unknown>();

/**
 * 从 JSON 文件读取数据
 * @param dataDir - 数据文件目录路径
 * @param fileName - 文件名（不含扩展名）
 * @returns 解析后的 JSON 数据
 */
function readJsonFile<T>(dataDir: string, fileName: string): T {
  const cacheKey = fileName;

  // 优先从缓存读取
  if (dataCache.has(cacheKey)) {
    return dataCache.get(cacheKey) as T;
  }

  const filePath = path.resolve(dataDir, `${fileName}.json`);

  // 检查文件是否存在
  if (!fs.existsSync(filePath)) {
    throw new Error(`数据文件不存在: ${filePath}`);
  }

  // 同步读取文件内容
  const rawContent = fs.readFileSync(filePath, 'utf-8');

  // 解析 JSON
  try {
    const data = JSON.parse(rawContent) as T;
    // 写入缓存
    dataCache.set(cacheKey, data);
    return data;
  } catch (parseError) {
    throw new Error(`JSON 解析失败 (${fileName}.json): ${(parseError as Error).message}`);
  }
}

/**
 * 数据服务类
 * 封装所有数据读取操作
 */
export class DataService {
  private dataDir: string;

  constructor(dataDir: string) {
    this.dataDir = dataDir;
  }

  /** 获取历史事件列表 */
  getHistory(): HistoryEventItem[] {
    return readJsonFile<HistoryEventItem[]>(this.dataDir, 'history');
  }

  /** 获取行当分类列表 */
  getRoles(): RoleCategoryItem[] {
    return readJsonFile<RoleCategoryItem[]>(this.dataDir, 'roles');
  }

  /** 获取脸谱服饰列表 */
  getCostumesMakeup(): CostumeMakeupItem[] {
    return readJsonFile<CostumeMakeupItem[]>(this.dataDir, 'costumes-makeup');
  }

  /** 获取名家剧目列表 */
  getArtistsPlays(): ArtistPlayItem[] {
    return readJsonFile<ArtistPlayItem[]>(this.dataDir, 'artists-plays');
  }

  /** 获取媒体资源列表 */
  getMedia(): MediaResourceItem[] {
    return readJsonFile<MediaResourceItem[]>(this.dataDir, 'media');
  }

  /** 获取全部数据（汇总接口） */
  getAllData() {
    return {
      history: this.getHistory(),
      roles: this.getRoles(),
      costumesMakeup: this.getCostumesMakeup(),
      artistsPlays: this.getArtistsPlays(),
      media: this.getMedia(),
    };
  }

  /** 清除缓存（用于数据更新后刷新） */
  clearCache(): void {
    dataCache.clear();
  }
}

export default DataService;
