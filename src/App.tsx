import React, { useState, useEffect } from 'react';
import { Layout, Typography, Space, Toast } from '@douyinfe/semi-ui';
import { IconSearch } from '@douyinfe/semi-icons';
import { ThemeProvider } from './contexts/ThemeContext';
import SearchForm from './components/SearchForm/SearchForm';
import SearchResults from './components/SearchResults/SearchResults';
import ThemeToggle from './components/ThemeToggle/ThemeToggle';
import { SearchParams, SearchResponse } from './types';
import { searchResources, checkHealth } from './services/api';

const { Header, Content } = Layout;
const { Title } = Typography;

const App: React.FC = () => {
  const [searchData, setSearchData] = useState<SearchResponse | undefined>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [healthStatus, setHealthStatus] = useState<boolean>(true);

  // 检查API健康状态
  useEffect(() => {
    const checkApiHealth = async () => {
      try {
        await checkHealth();
        setHealthStatus(true);
      } catch (err) {
        console.error('API健康检查失败:', err);
        setHealthStatus(false);
        Toast.error('API服务连接失败，请检查网络连接');
      }
    };

    checkApiHealth();
  }, []);

  // 计算总结果数
  const getTotalResults = (data: SearchResponse) => {
    // 如果API返回了total字段，使用它
    if (typeof data.total === 'number') {
      return data.total;
    }
    
    // 否则计算merged_by_type中所有结果的总数
    if (data.merged_by_type) {
      return Object.values(data.merged_by_type).reduce((total, resources) => {
        return total + (resources ? resources.length : 0);
      }, 0);
    }
    
    return 0;
  };

  const handleSearch = async (params: SearchParams) => {
    if (!params.kw.trim()) {
      Toast.error('请输入搜索关键词');
      return;
    }

    setLoading(true);
    setError(undefined);
    setSearchData(undefined);

    try {
      const data = await searchResources(params);
      setSearchData(data);
      
      // 添加调试信息
      console.log('API返回数据:', data);
      
      const totalResults = getTotalResults(data);
      
      if (totalResults === 0) {
        Toast.info('未找到相关资源');
      } else {
        Toast.success(`找到 ${totalResults} 个结果`);
      }
    } catch (err) {
      console.error('搜索失败:', err);
      setError(err instanceof Error ? err.message : '搜索失败，请稍后重试');
      Toast.error('搜索失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider>
      <Layout style={{ minHeight: '100vh' }}>
        <Header style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          padding: '0 24px',
          backgroundColor: 'var(--semi-color-bg-1)',
          borderBottom: '1px solid var(--semi-color-border)'
        }}>
          <Space spacing="tight">
            <IconSearch style={{ fontSize: 24, color: 'var(--semi-color-primary)' }} />
            <Title heading={3} style={{ margin: 0, color: 'var(--semi-color-text-0)' }}>
              盘搜
            </Title>
          </Space>
          <ThemeToggle />
        </Header>

        <Content style={{ 
          padding: '24px',
          backgroundColor: 'var(--semi-color-bg-0)',
          minHeight: 'calc(100vh - 64px)'
        }}>
          <div style={{ 
            maxWidth: 1200, 
            margin: '0 auto',
            width: '100%'
          }}>
            {/* API状态提示 */}
            {!healthStatus && (
              <div style={{
                padding: '12px 16px',
                backgroundColor: 'var(--semi-color-warning-light)',
                border: '1px solid var(--semi-color-warning)',
                borderRadius: 6,
                marginBottom: 16,
                color: 'var(--semi-color-warning)',
                fontSize: 14
              }}>
                ⚠️ API服务连接异常，搜索功能可能不可用
              </div>
            )}

            {/* 搜索表单 */}
            <SearchForm onSearch={handleSearch} loading={loading} />

            {/* 搜索结果 */}
            <SearchResults 
              data={searchData} 
              loading={loading} 
              error={error} 
            />
          </div>
        </Content>
      </Layout>
    </ThemeProvider>
  );
};

export default App; 