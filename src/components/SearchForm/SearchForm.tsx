import React, { useState } from "react";
import {
  Input,
  Button,
  Select,
  Checkbox,
  Collapse,
  Tag,
  Space,
  Typography,
  Card,
} from "antd";
import { SearchOutlined, FilterOutlined } from "@ant-design/icons";
import { SearchParams, CLOUD_TYPES } from "../../types";

const { Title, Text } = Typography;
const { Option } = Select;

interface SearchFormProps {
  onSearch: (params: SearchParams) => void;
  loading?: boolean;
}

const SearchForm: React.FC<SearchFormProps> = ({
  onSearch,
  loading = false,
}) => {
  const [keyword, setKeyword] = useState("");
  const [resultType, setResultType] = useState<"all" | "results" | "merge">(
    "merge"
  );
  const [sourceType, setSourceType] = useState<"all" | "tg" | "plugin">("all");
  const [cloudTypes, setCloudTypes] = useState<string[]>([]);
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

    if (cloudTypes.length > 0) {
      searchParams.cloud_types = cloudTypes;
    }

    onSearch(searchParams);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // 高级搜索选项内容
  const advancedContent = (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      {/* 网盘类型选择 */}
      <div>
        <Text
          strong
          style={{ color: "#333", display: "block", marginBottom: 8 }}
        >
          网盘类型:
        </Text>
        <Checkbox.Group
          value={cloudTypes}
          onChange={setCloudTypes}
          style={{ display: "flex", flexWrap: "wrap", gap: 8 }}
        >
          {Object.entries(CLOUD_TYPES).map(([key, value]) => (
            <Checkbox key={key} value={key} style={{ color: "#666" }}>
              {value}
            </Checkbox>
          ))}
        </Checkbox.Group>
      </div>

      {/* 已选择的网盘类型 */}
      {cloudTypes.length > 0 && (
        <div>
          <Text
            strong
            style={{ color: "#333", display: "block", marginBottom: 8 }}
          >
            已选择:
          </Text>
          <Space wrap>
            {cloudTypes.map((type) => (
              <Tag
                key={type}
                closable
                onClose={() =>
                  setCloudTypes(cloudTypes.filter((t) => t !== type))
                }
                style={{ borderRadius: 6 }}
              >
                {CLOUD_TYPES[type as keyof typeof CLOUD_TYPES] || type}
              </Tag>
            ))}
          </Space>
        </div>
      )}

      {/* 其他选项 */}
      <div>
        <Text
          strong
          style={{ color: "#333", display: "block", marginBottom: 8 }}
        >
          刷新缓存:
        </Text>
        <Checkbox
          checked={refresh}
          onChange={(e) => setRefresh(e.target.checked)}
          style={{ color: "#666" }}
        >
          强制刷新
        </Checkbox>
      </div>
    </Space>
  );

  return (
    <Card style={{ marginBottom: 24 }}>
      {/* 主要搜索区域 */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          {/* 搜索输入框 */}
          <div style={{ flex: 1 }}>
            <Input
              size="large"
              placeholder="输入搜索关键词..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyPress={handleKeyPress}
              prefix={<SearchOutlined style={{ color: "#666" }} />}
              style={{ borderRadius: 8 }}
            />
          </div>

          {/* 搜索按钮 */}
          <Button
            type="primary"
            size="large"
            loading={loading}
            onClick={handleSearch}
            icon={<SearchOutlined />}
            style={{
              borderRadius: 8,
              background: "#1890ff",
              borderColor: "#1890ff",
            }}
          >
            搜索
          </Button>
        </div>

        {/* 搜索选项 */}
        <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
          <Select
            value={resultType}
            onChange={setResultType}
            style={{ width: 140 }}
            placeholder="结果类型"
          >
            <Option value="all">全部结果</Option>
            <Option value="results">原始结果</Option>
            <Option value="merge">按类型合并</Option>
          </Select>

          <Select
            value={sourceType}
            onChange={setSourceType}
            style={{ width: 140 }}
            placeholder="数据来源"
          >
            <Option value="all">全部来源</Option>
            <Option value="tg">Telegram</Option>
            <Option value="plugin">插件</Option>
          </Select>
        </div>
      </div>

      {/* 高级搜索选项 */}
      <Collapse
        ghost
        size="small"
        items={[
          {
            key: "1",
            label: (
              <span style={{ color: "#333", fontWeight: 500 }}>
                <FilterOutlined style={{ marginRight: 8 }} />
                高级搜索选项
              </span>
            ),
            children: advancedContent,
          },
        ]}
      />
    </Card>
  );
};

export default SearchForm;
