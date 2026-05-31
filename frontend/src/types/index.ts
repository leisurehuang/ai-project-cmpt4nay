/**
 * 全局 TypeScript 类型定义
 * 定义了秦腔科普网站所有数据模型的强类型接口
 * 这些接口与 public/assets/data/ 目录下的 JSON 数据文件结构一一对应
 */

/** 历史起源模块 - 单条历史事件 */
export interface HistoryEvent {
  id: string;
  year: string;
  title: string;
  description: string;
  imageUrl?: string;
}

/** 行当分类模块 - 四大行当 */
export interface RoleCategory {
  id: string;
  name: string;
  icon: string;
  features: string;
  representativeFigures: string;
}

/** 脸谱与服饰图鉴模块 - 脸谱或服饰条目 */
export interface CostumeMakeup {
  id: string;
  title: string;
  category: '脸谱' | '服饰';
  colorMeaning?: string;
  imageUrl: string;
}

/** 名家与经典剧目模块 - 名家及其代表剧目 */
export interface ArtistPlay {
  id: string;
  artistName: string;
  playTitle: string;
  synopsis: string;
  mediaUrl?: string;
}

/** 视听体验模块 - 音视频资源 */
export interface MediaResource {
  id: string;
  title: string;
  type: 'audio' | 'video';
  source: 'local' | 'bilibili';
  url: string;
  coverUrl?: string;
  description: string;
}
