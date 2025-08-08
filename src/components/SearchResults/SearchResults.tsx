import React from 'react';
import { 
  Card, 
  Typography, 
  Space, 
  Button, 
  Empty, 
  Spin,
  Tag,
  Image
} from '@douyinfe/semi-ui';
import { IconCopy, IconLink } from '@douyinfe/semi-icons';
import { SearchResponse, MergedResult, CLOUD_TYPES } from '../../types';
import { copyToClipboard } from '../../services/api';

const { Title, Text } = Typography;

interface SearchResultsProps {
  data?: SearchResponse;
  loading?: boolean;
  error?: string;
}

const SearchResults: React.FC<SearchResultsProps> = ({ data, loading, error }) => {
  // 添加调试信息
  console.log('SearchResults data:', data);
  
  const handleCopyLink = async (url: string) => {
    try {
      await copyToClipboard(url);
      // 这里可以添加成功提示
    } catch (err) {
      console.error('复制失败:', err);
    }
  };

  const handleCopyPassword = async (password: string) => {
    try {
      await copyToClipboard(password);
      // 这里可以添加成功提示
    } catch (err) {
      console.error('复制失败:', err);
    }
  };

  const formatDateTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleString('zh-CN');
  };

  // 计算总结果数
  const getTotalResults = () => {
    if (!data) return 0;
    return data.total || 0;
  };

  // 检查是否有merged_by_type数据
  const hasMergedData = (data: SearchResponse): data is SearchResponse & { merged_by_type: Record<string, MergedResult[]> } => {
    return 'merged_by_type' in data && data.merged_by_type !== undefined;
  };

  // 检查是否有results数据
  const hasResultsData = (data: SearchResponse): data is SearchResponse & { results: any[] } => {
    return 'results' in data && data.results !== undefined;
  };

  const renderResourceCard = (resource: MergedResult, cloudType: string) => (
    <Card
      key={`${cloudType}-${resource.url}`}
      style={{ marginBottom: 8 }}
      bodyStyle={{ padding: 12 }}
    >
      <Space vertical spacing="tight" style={{ width: '100%' }}>
        {/* 标题和来源 */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Text strong style={{ flex: 1, marginRight: 8 }}>
            {resource.note}
          </Text>
          <Tag size="small" color="blue">
            {CLOUD_TYPES[cloudType as keyof typeof CLOUD_TYPES] || cloudType}
          </Tag>
        </div>

        {/* 链接和操作 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Text type="secondary" style={{ flex: 1, fontSize: 12 }}>
            {resource.url}
          </Text>
          <Space spacing="tight">
            <Button
              icon={<IconLink />}
              size="small"
              type="tertiary"
              onClick={() => window.open(resource.url, '_blank')}
            >
              打开
            </Button>
            <Button
              icon={<IconCopy />}
              size="small"
              type="tertiary"
              onClick={() => handleCopyLink(resource.url)}
            >
              复制链接
            </Button>
          </Space>
        </div>

        {/* 密码和来源信息 */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Space spacing="tight">
            {resource.password && (
              <Space spacing="tight">
                <Text type="secondary" size="small">密码:</Text>
                <Text code size="small">{resource.password}</Text>
                <Button
                  size="small"
                  type="tertiary"
                  onClick={() => handleCopyPassword(resource.password)}
                >
                  复制
                </Button>
              </Space>
            )}
          </Space>
          <Text type="tertiary" size="small">
            {formatDateTime(resource.datetime)}
          </Text>
        </div>

        {/* 来源信息 */}
        <Text type="tertiary" size="small">
          来源: {resource.source}
        </Text>

        {/* 图片预览 */}
        {resource.images && resource.images.length > 0 && (
          <div style={{ marginTop: 8 }}>
            <Space spacing="tight">
              {resource.images.slice(0, 3).map((image, index) => (
                <Image
                  key={index}
                  src={image}
                  width={60}
                  height={60}
                  style={{ objectFit: 'cover', borderRadius: 4 }}
                  fallback="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjYwIiBoZWlnaHQ9IjYwIiBmaWxsPSIjRjVGNUY1Ii8+CjxwYXRoIGQ9Ik0yMCAyMEg0MFY0MEgyMFYyMFoiIGZpbGw9IiNDQ0NDQ0MiLz4KPC9zdmc+"
                />
              ))}
              {resource.images.length > 3 && (
                <div style={{ 
                  width: 60, 
                  height: 60, 
                  backgroundColor: '#f5f5f5', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  borderRadius: 4,
                  fontSize: 12,
                  color: '#999'
                }}>
                  +{resource.images.length - 3}
                </div>
              )}
            </Space>
          </div>
        )}
      </Space>
    </Card>
  );

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: 40 }}>
        <Spin size="large" />
        <div style={{ marginTop: 16 }}>
          <Text>正在搜索中...</Text>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <Empty
          description={error}
        />
      </Card>
    );
  }

  if (!data) {
    return (
      <Card>
        <Empty
          description="暂无搜索结果"
        />
      </Card>
    );
  }

  const totalResults = getTotalResults();

  // 优先显示merged_by_type数据（如果存在）
  if (hasMergedData(data)) {
    const cloudTypes = Object.keys(data.merged_by_type);

    if (cloudTypes.length === 0) {
      return (
        <Card>
          <Empty
            description="未找到相关资源"
          />
        </Card>
      );
    }

    return (
      <Space vertical spacing="loose" style={{ width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Title heading={4}>搜索结果</Title>
          <Text type="secondary">共找到 {totalResults} 个结果</Text>
        </div>

        {cloudTypes.map((cloudType) => {
          const resources = data.merged_by_type[cloudType];
          const cloudTypeName = CLOUD_TYPES[cloudType as keyof typeof CLOUD_TYPES] || cloudType;

          return (
            <Card key={cloudType} style={{ marginBottom: 16 }}>
              <div style={{ marginBottom: 16 }}>
                <Title heading={5}>
                  {cloudTypeName} ({resources.length})
                </Title>
              </div>
              <Space vertical spacing="tight" style={{ width: '100%' }}>
                {resources.map((resource) => renderResourceCard(resource, cloudType))}
              </Space>
            </Card>
          );
        })}
      </Space>
    );
  }

  // 如果有results数据，显示原始结果
  if (hasResultsData(data)) {
    return (
      <Space vertical spacing="loose" style={{ width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Title heading={4}>搜索结果</Title>
          <Text type="secondary">共找到 {totalResults} 个结果</Text>
        </div>

        <Card>
          <div style={{ marginBottom: 16 }}>
            <Title heading={5}>原始结果 ({data.results.length})</Title>
          </div>
          <Space vertical spacing="tight" style={{ width: '100%' }}>
            {data.results.map((result, index) => (
              <Card key={index} style={{ marginBottom: 8 }} bodyStyle={{ padding: 12 }}>
                <Space vertical spacing="tight" style={{ width: '100%' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Text strong style={{ flex: 1, marginRight: 8 }}>
                      {result.title}
                    </Text>
                    <Tag size="small" color="green">
                      {result.channel}
                    </Tag>
                  </div>
                  <Text type="secondary">{result.content}</Text>
                  <Text type="tertiary" size="small">
                    {formatDateTime(result.datetime)}
                  </Text>
                </Space>
              </Card>
            ))}
          </Space>
        </Card>
      </Space>
    );
  }

  // 如果既没有merged_by_type也没有results，显示空状态
  return (
    <Card>
      <Empty
        description="未找到相关资源"
      />
    </Card>
  );
};

export default SearchResults; 