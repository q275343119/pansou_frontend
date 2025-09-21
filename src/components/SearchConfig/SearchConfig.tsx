// src/components/SearchConfig/SearchConfig.tsx
import React, { useState, useEffect } from "react";
import {
  Typography,
  Checkbox,
  Select,
  Tag,
  Space,
  Divider,
  Card,
} from "@douyinfe/semi-ui";
import { CLOUD_TYPES } from "../../types";

const { Title, Text } = Typography;

interface SearchConfigProps {
  onConfigChange?: (config: SearchConfigType) => void;
}

export interface SearchConfigType {
  resultType: "all" | "results" | "merge";
  sourceType: "all" | "tg" | "plugin";
  cloudTypes: string[];
  refresh: boolean;
}

const SearchConfig: React.FC<SearchConfigProps> = ({ onConfigChange }) => {
  const [resultType, setResultType] = useState<"all" | "results" | "merge">(
    "merge"
  );
  const [sourceType, setSourceType] = useState<"all" | "tg" | "plugin">("all");
  // 默认选择所有网盘类型
  const [cloudTypes, setCloudTypes] = useState<string[]>(
    Object.keys(CLOUD_TYPES)
  );
  const [refresh, setRefresh] = useState(false);

  // 初始化时通知父组件默认配置
  useEffect(() => {
    const initialConfig: SearchConfigType = {
      resultType,
      sourceType,
      cloudTypes,
      refresh,
    };
    onConfigChange?.(initialConfig);
  }, []); // 只在组件挂载时执行一次

  const handleConfigChange = (newConfig: Partial<SearchConfigType>) => {
    const config = {
      resultType,
      sourceType,
      cloudTypes,
      refresh,
      ...newConfig,
    };
    onConfigChange?.(config);
  };

  const handleResultTypeChange = (value: string) => {
    const newType = value as "all" | "results" | "merge";
    setResultType(newType);
    handleConfigChange({ resultType: newType });
  };

  const handleSourceTypeChange = (value: string) => {
    const newType = value as "all" | "tg" | "plugin";
    setSourceType(newType);
    handleConfigChange({ sourceType: newType });
  };

  const handleCloudTypesChange = (checked: boolean, value: string) => {
    const newCloudTypes = checked
      ? [...cloudTypes, value]
      : cloudTypes.filter((type) => type !== value);
    setCloudTypes(newCloudTypes);
    handleConfigChange({ cloudTypes: newCloudTypes });
  };

  const handleRefreshChange = (checked: boolean) => {
    setRefresh(checked);
    handleConfigChange({ refresh: checked });
  };

  const removeCloudType = (type: string) => {
    const newCloudTypes = cloudTypes.filter((t) => t !== type);
    setCloudTypes(newCloudTypes);
    handleConfigChange({ cloudTypes: newCloudTypes });
  };

  return (
    <div style={{ padding: 16 }}>
      <Title
        level={4}
        style={{ margin: "0 0 16px 0", color: "var(--semi-color-text-0)" }}
      >
        搜索设置
      </Title>

      {/* 结果类型选择 */}
      <Card style={{ marginBottom: 16 }}>
        <div style={{ marginBottom: 12 }}>
          <Text strong style={{ display: "block", marginBottom: 8 }}>
            结果类型
          </Text>
          <Select
            value={resultType}
            onChange={handleResultTypeChange}
            style={{ width: "100%" }}
          >
            <Select.Option value="merge">按类型合并</Select.Option>
            <Select.Option value="all">全部结果</Select.Option>
            <Select.Option value="results">原始结果</Select.Option>
          </Select>
        </div>
      </Card>

      {/* 数据来源选择 */}
      <Card style={{ marginBottom: 16 }}>
        <div style={{ marginBottom: 12 }}>
          <Text strong style={{ display: "block", marginBottom: 8 }}>
            数据来源
          </Text>
          <Select
            value={sourceType}
            onChange={handleSourceTypeChange}
            style={{ width: "100%" }}
          >
            <Select.Option value="all">全部来源</Select.Option>
            <Select.Option value="tg">Telegram</Select.Option>
            <Select.Option value="plugin">插件</Select.Option>
          </Select>
        </div>
      </Card>

      {/* 网盘类型选择 */}
      <Card style={{ marginBottom: 16 }}>
        <div>
          <Text strong style={{ display: "block", marginBottom: 8 }}>
            网盘类型
          </Text>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {Object.entries(CLOUD_TYPES).map(([key, value]) => (
              <Checkbox
                key={key}
                checked={cloudTypes.includes(key)}
                onChange={(e) => handleCloudTypesChange(e.target.checked, key)}
                style={{ color: "var(--semi-color-text-1)" }}
              >
                {value}
              </Checkbox>
            ))}
          </div>
        </div>
      </Card>

      {/* 其他选项 */}
      <Card>
        <div>
          <Text strong style={{ display: "block", marginBottom: 8 }}>
            其他选项
          </Text>
          <Checkbox
            checked={refresh}
            onChange={(e) => handleRefreshChange(e.target.checked)}
            style={{ color: "var(--semi-color-text-1)" }}
          >
            强制刷新缓存
          </Checkbox>
        </div>
      </Card>
    </div>
  );
};

export default SearchConfig;
