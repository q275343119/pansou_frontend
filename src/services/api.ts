import { SearchParams, SearchResponse, HealthResponse, ApiResponse } from '../types';
import { config } from '../config';

// 通用请求函数
async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  // 如果配置了API基础URL，使用完整URL；否则使用相对路径（通过代理）
  const baseUrl = config.apiBaseUrl || '';
  const url = baseUrl ? `${baseUrl}${endpoint}` : endpoint;
  
  console.log('API请求:', url, options);
  
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    console.log('API响应状态:', response.status, response.statusText);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('API响应数据:', data);
    
    return data;
  } catch (error) {
    console.error('API请求失败:', error);
    throw error;
  }
}

export async function searchResources(params: SearchParams): Promise<SearchResponse> {
  const searchParams = new URLSearchParams();
  
  // 添加搜索关键词
  searchParams.append('kw', params.kw);
  
  // 添加可选参数
  if (params.channels && params.channels.length > 0) {
    searchParams.append('channels', params.channels.join(','));
  }
  
  if (params.conc !== undefined) {
    searchParams.append('conc', params.conc.toString());
  }
  
  if (params.refresh !== undefined) {
    searchParams.append('refresh', params.refresh.toString());
  }
  
  if (params.res) {
    searchParams.append('res', params.res);
  }
  
  if (params.src) {
    searchParams.append('src', params.src);
  }
  
  if (params.plugins && params.plugins.length > 0) {
    searchParams.append('plugins', params.plugins.join(','));
  }
  
  if (params.cloud_types && params.cloud_types.length > 0) {
    searchParams.append('cloud_types', params.cloud_types.join(','));
  }
  
  if (params.ext) {
    searchParams.append('ext', JSON.stringify(params.ext));
  }

  console.log('搜索参数:', searchParams.toString());

  const response = await request<ApiResponse<SearchResponse>>(`/api/search?${searchParams.toString()}`);

  if (response.code !== 0) {
    throw new Error(response.message || '搜索失败');
  }

  return response.data;
}

export async function checkHealth(): Promise<HealthResponse> {
  try {
    console.log('开始健康检查...');
    const response = await request<any>('/api/health');
    
    console.log('健康检查响应:', response);

    // 检查是否是包装格式的响应
    if ('code' in response && 'data' in response && 'message' in response) {
      // 如果是包装格式，检查code并返回data
      const apiResponse = response as ApiResponse<HealthResponse>;
      if (apiResponse.code !== 0) {
        throw new Error(apiResponse.message || '健康检查失败');
      }
      return apiResponse.data;
    } else {
      // 如果不是包装格式，直接返回响应
      return response as HealthResponse;
    }
  } catch (error) {
    console.error('健康检查详细错误:', error);
    if (error instanceof Error) {
      throw new Error(`健康检查失败: ${error.message}`);
    }
    throw new Error('健康检查失败: 未知错误');
  }
}

export async function copyToClipboard(text: string): Promise<void> {
  if (navigator.clipboard) {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error('Clipboard API 失败，使用备用方法:', err);
      fallbackCopyToClipboard(text);
    }
  } else {
    fallbackCopyToClipboard(text);
  }
}

function fallbackCopyToClipboard(text: string): void {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.style.position = 'fixed';
  textArea.style.left = '-999999px';
  textArea.style.top = '-999999px';
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  
  try {
    document.execCommand('copy');
  } catch (err) {
    console.error('备用复制方法失败:', err);
  } finally {
    document.body.removeChild(textArea);
  }
} 