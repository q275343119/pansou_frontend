// 环境配置
interface Config {
  apiBaseUrl: string;
  appName: string;
  version: string;
  gitRepoUrl: string;
}

// 从环境变量获取配置，如果没有则使用默认值
const getConfig = (): Config => {
  // 开发环境使用相对路径，生产环境可以配置完整URL
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || '';
  const appName = import.meta.env.VITE_APP_NAME || '盘搜';
  const version = import.meta.env.VITE_APP_VERSION || '1.0.0';
  const gitRepoUrl = import.meta.env.VITE_GIT_REPO_URL || '';
  
  return {
    apiBaseUrl,
    appName,
    version,
    gitRepoUrl
  };
};

export const config = getConfig();

// 导出配置信息，方便调试
console.log('当前配置:', config);
console.log('环境变量检查:', {
  VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
  VITE_APP_NAME: import.meta.env.VITE_APP_NAME,
  VITE_APP_VERSION: import.meta.env.VITE_APP_VERSION,
  VITE_GIT_REPO_URL: import.meta.env.VITE_GIT_REPO_URL,
  MODE: import.meta.env.MODE
}); 