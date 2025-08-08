// API 响应类型定义
export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

// 基础搜索响应（所有类型都包含total）
export interface BaseSearchResponse {
  total: number;
}

// 原始结果响应
export interface ResultsSearchResponse extends BaseSearchResponse {
  results: SearchResult[];
}

// 合并结果响应
export interface MergeSearchResponse extends BaseSearchResponse {
  merged_by_type: Record<string, MergedResult[]>;
}

// 完整搜索响应（包含所有字段）
export interface FullSearchResponse extends BaseSearchResponse {
  results: SearchResult[];
  merged_by_type: Record<string, MergedResult[]>;
}

// 根据res参数确定的搜索响应类型
export type SearchResponse = ResultsSearchResponse | MergeSearchResponse | FullSearchResponse;

export interface SearchResult {
  message_id: string;
  unique_id: string;
  channel: string;
  datetime: string;
  title: string;
  content: string;
  links: ResourceLink[];
  tags: string[];
  images: string[];
}

export interface MergedResult {
  url: string;
  password: string;
  note: string;
  datetime: string;
  source: string;
  images: string[];
}

export interface ResourceLink {
  type: string;
  url: string;
  password: string;
}

// 搜索参数类型定义
export interface SearchParams {
  kw: string;
  channels?: string[];
  conc?: number;
  refresh?: boolean;
  res?: 'all' | 'results' | 'merge';
  src?: 'all' | 'tg' | 'plugin';
  plugins?: string[];
  cloud_types?: string[];
  ext?: Record<string, any>;
}

// 健康检查响应类型
export interface HealthResponse {
  channels: string[];
  plugin_count: number;
  plugins: string[];
  plugins_enabled: boolean;
  status: string;
}

// 网盘类型枚举
export const CLOUD_TYPES = {
  baidu: '百度网盘',
  aliyun: '阿里云盘',
  quark: '夸克网盘',
  tianyi: '天翼云盘',
  uc: 'UC网盘',
  mobile: '移动云盘',
  '115': '115网盘',
  pikpak: 'PikPak',
  xunlei: '迅雷网盘',
  '123': '123云盘',
  magnet: '磁力链接',
  ed2k: '电驴链接'
} as const;

export type CloudType = keyof typeof CLOUD_TYPES;

// 数据来源类型
export const SOURCE_TYPES = {
  all: '全部来源',
  tg: 'Telegram',
  plugin: '插件'
} as const;

export type SourceType = keyof typeof SOURCE_TYPES;

// 结果类型
export const RESULT_TYPES = {
  all: '全部结果',
  results: '原始结果',
  merge: '按类型合并'
} as const;

export type ResultType = keyof typeof RESULT_TYPES; 