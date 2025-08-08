import React, { useState } from 'react';
import { 
  Input, 
  Button, 
  Card, 
  Space, 
  Typography, 
  Select, 
  Checkbox,
  Collapsible
} from '@douyinfe/semi-ui';
import { IconSearch, IconChevronDown, IconChevronUp } from '@douyinfe/semi-icons';
import { SearchParams, CLOUD_TYPES, SOURCE_TYPES, RESULT_TYPES } from '../../types';

const { Title } = Typography;

interface SearchFormProps {
  onSearch: (params: SearchParams) => void;
  loading?: boolean;
}

const SearchForm: React.FC<SearchFormProps> = ({ onSearch, loading = false }) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [resultType, setResultType] = useState<'all' | 'results' | 'merge'>('merge');
  const [sourceType, setSourceType] = useState<'all' | 'tg' | 'plugin'>('all');
  const [cloudTypes, setCloudTypes] = useState<string[]>([]);
  const [channels, setChannels] = useState<string[]>([]);
  const [plugins, setPlugins] = useState<string[]>([]);
  const [conc, setConc] = useState<number | undefined>();
  const [refresh, setRefresh] = useState(false);

  const handleSearch = () => {
    if (!keyword.trim()) {
      return;
    }

    const searchParams: SearchParams = {
      kw: keyword,
      res: resultType,
      src: sourceType,
      refresh,
    };

    // 添加可选参数
    if (cloudTypes.length > 0) {
      searchParams.cloud_types = cloudTypes;
    }

    if (channels.length > 0) {
      searchParams.channels = channels;
    }

    if (plugins.length > 0) {
      searchParams.plugins = plugins;
    }

    if (conc) {
      searchParams.conc = conc;
    }

    onSearch(searchParams);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <Card style={{ marginBottom: 16 }}>
      <Space vertical spacing="loose" style={{ width: '100%' }}>
        {/* 基础搜索区域 */}
        <Space spacing="tight" style={{ width: '100%' }}>
          <Input
            value={keyword}
            onChange={setKeyword}
            placeholder="输入搜索关键词..."
            size="large"
            style={{ flex: 1 }}
            onKeyPress={handleKeyPress}
            showClear
          />
          <Button
            icon={<IconSearch />}
            type="primary"
            size="large"
            onClick={handleSearch}
            loading={loading}
          >
            搜索
          </Button>
        </Space>

        {/* 高级搜索选项 */}
        <div>
          <Button
            type="tertiary"
            icon={showAdvanced ? <IconChevronUp /> : <IconChevronDown />}
            onClick={() => setShowAdvanced(!showAdvanced)}
            style={{ padding: 0 }}
          >
            高级搜索选项
          </Button>
        </div>

        <Collapsible isOpen={showAdvanced}>
          <Space vertical spacing="loose" style={{ width: '100%' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {/* 结果类型 */}
              <div>
                <div style={{ marginBottom: 8, fontSize: 14, fontWeight: 500 }}>结果类型</div>
                <Select
                  value={resultType}
                  onChange={setResultType}
                  placeholder="选择结果类型"
                  style={{ width: '100%' }}
                >
                  {Object.entries(RESULT_TYPES).map(([key, value]) => (
                    <Select.Option key={key} value={key}>
                      {value}
                    </Select.Option>
                  ))}
                </Select>
              </div>

              {/* 数据来源 */}
              <div>
                <div style={{ marginBottom: 8, fontSize: 14, fontWeight: 500 }}>数据来源</div>
                <Select
                  value={sourceType}
                  onChange={setSourceType}
                  placeholder="选择数据来源"
                  style={{ width: '100%' }}
                >
                  {Object.entries(SOURCE_TYPES).map(([key, value]) => (
                    <Select.Option key={key} value={key}>
                      {value}
                    </Select.Option>
                  ))}
                </Select>
              </div>
            </div>

            {/* 网盘类型 */}
            <div>
              <div style={{ marginBottom: 8, fontSize: 14, fontWeight: 500 }}>网盘类型</div>
              <Select
                value={cloudTypes}
                onChange={setCloudTypes}
                placeholder="选择网盘类型（可多选）"
                multiple
                style={{ width: '100%' }}
              >
                {Object.entries(CLOUD_TYPES).map(([key, value]) => (
                  <Select.Option key={key} value={key}>
                    {value}
                  </Select.Option>
                ))}
              </Select>
            </div>

            {/* 频道和插件 */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <div style={{ marginBottom: 8, fontSize: 14, fontWeight: 500 }}>频道</div>
                <Select
                  value={channels}
                  onChange={setChannels}
                  placeholder="选择频道（可多选）"
                  multiple
                  style={{ width: '100%' }}
                >
                  <Select.Option value="tgsearchers2">tgsearchers2</Select.Option>
                </Select>
              </div>

              <div>
                <div style={{ marginBottom: 8, fontSize: 14, fontWeight: 500 }}>插件</div>
                <Select
                  value={plugins}
                  onChange={setPlugins}
                  placeholder="选择插件（可多选）"
                  multiple
                  style={{ width: '100%' }}
                >
                  <Select.Option value="jikepan">jikepan</Select.Option>
                  <Select.Option value="pansearch">pansearch</Select.Option>
                </Select>
              </div>
            </div>

            {/* 其他选项 */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <div style={{ marginBottom: 8, fontSize: 14, fontWeight: 500 }}>并发数量</div>
                <Input
                  type="number"
                  value={conc || ''}
                  onChange={(value) => setConc(value ? Number(value) : undefined)}
                  placeholder="并发搜索数量"
                  min={1}
                  max={50}
                  style={{ width: '100%' }}
                />
              </div>

              <div style={{ marginTop: 32 }}>
                <Checkbox
                  checked={refresh}
                  onChange={setRefresh}
                >
                  强制刷新（不使用缓存）
                </Checkbox>
              </div>
            </div>
          </Space>
        </Collapsible>
      </Space>
    </Card>
  );
};

export default SearchForm; 