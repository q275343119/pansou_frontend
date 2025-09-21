// src/components/SearchResults/SearchResults.tsx
import React, { useState } from "react";
import {
  Card,
  Typography,
  Button,
  Empty,
  Spin,
  Tag,
  Image,
  Tooltip,
  Tabs,
  Space,
  Toast,
} from "@douyinfe/semi-ui";
import { IconCopy, IconLink } from "@douyinfe/semi-icons";
import { SearchResponse, MergedResult, CLOUD_TYPES } from "../../types";
import { copyToClipboard } from "../../services/api";

const { Title, Text } = Typography;
const { TabPane } = Tabs;

interface SearchResultsProps {
  data?: SearchResponse;
  loading?: boolean;
  error?: string;
}

const SearchResults: React.FC<SearchResultsProps> = ({
  data,
  loading,
  error,
}) => {
  const [activeTab, setActiveTab] = useState<string>("");

  const handleCopyLink = async (url: string) => {
    try {
      await copyToClipboard(url);
      Toast.success("链接已复制到剪贴板");
    } catch (err) {
      console.error("复制失败:", err);
      Toast.error("复制失败");
    }
  };

  const handleCopyPassword = async (password: string) => {
    try {
      await copyToClipboard(password);
      Toast.success("密码已复制到剪贴板");
    } catch (err) {
      console.error("复制失败:", err);
      Toast.error("复制失败");
    }
  };

  const formatDateTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleString("zh-CN");
  };

  const getTotalResults = () => {
    if (!data) return 0;
    return data.total || 0;
  };

  const hasMergedData = (
    data: SearchResponse
  ): data is SearchResponse & {
    merged_by_type: Record<string, MergedResult[]>;
  } => {
    return "merged_by_type" in data && data.merged_by_type !== undefined;
  };

  const hasResultsData = (
    data: SearchResponse
  ): data is SearchResponse & { results: any[] } => {
    return "results" in data && data.results !== undefined;
  };

  const renderResourceCard = (
    resource: MergedResult,
    cloudType: string,
    index: number
  ) => (
    <Card
      key={`card-${cloudType}-${resource.url}-${index}`}
      style={{
        marginBottom: 12,
        borderRadius: 8,
      }}
      bodyStyle={{ padding: 16 }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {/* 标题和来源 */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 12,
          }}
        >
          <div style={{ flex: 1 }}>
            <Text
              strong
              style={{
                fontSize: 16,
                color: "var(--semi-color-text-0)",
                display: "block",
                marginBottom: 4,
              }}
            >
              {resource.url}
            </Text>
            <Tag
              color="blue"
              style={{
                borderRadius: 6,
                marginBottom: 8,
              }}
            >
              {CLOUD_TYPES[cloudType as keyof typeof CLOUD_TYPES] || cloudType}
            </Tag>
          </div>
          <Space>
            <Tooltip content="复制链接">
              <Button
                theme="borderless"
                size="small"
                icon={<IconLink />}
                onClick={() => handleCopyLink(resource.url)}
              />
            </Tooltip>
          </Space>
        </div>

        {/* 密码信息 */}
        {resource.password && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "8px 12px",
              backgroundColor: "var(--semi-color-success-light-default)",
              borderRadius: 6,
              border: "1px solid var(--semi-color-success-light-active)",
            }}
          >
            <Text
              style={{
                fontWeight: 600,
                color: "var(--semi-color-text-1)",
                fontSize: 14,
              }}
            >
              密码:
            </Text>
            <Text
              code
              style={{
                color: "var(--semi-color-success)",
                fontSize: 14,
              }}
            >
              {resource.password}
            </Text>
            <Tooltip content="复制密码">
              <Button
                theme="borderless"
                size="small"
                icon={<IconCopy />}
                onClick={() => handleCopyPassword(resource.password)}
              />
            </Tooltip>
          </div>
        )}

        {/* 备注信息 */}
        {resource.note && (
          <Text
            style={{
              color: "var(--semi-color-text-1)",
              fontSize: 14,
              lineHeight: 1.5,
            }}
          >
            {resource.note}
          </Text>
        )}

        {/* 时间信息 */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <Text
            style={{
              color: "var(--semi-color-text-2)",
              fontSize: 12,
            }}
          >
            {formatDateTime(resource.datetime)}
          </Text>
          <Text
            style={{
              color: "var(--semi-color-text-2)",
              fontSize: 12,
            }}
          >
            来源: {resource.source}
          </Text>
        </div>

        {/* 图片预览 */}
        {resource.images && resource.images.length > 0 && (
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {resource.images.slice(0, 3).map((image, imgIndex) => (
              <Image
                key={imgIndex}
                src={image}
                alt={`预览图 ${imgIndex + 1}`}
                width={80}
                height={60}
                style={{
                  borderRadius: 6,
                  border: "1px solid var(--semi-color-border)",
                }}
              />
            ))}
          </div>
        )}
      </div>
    </Card>
  );

  // 加载状态
  if (loading) {
    return (
      <Card style={{ borderRadius: 8 }}>
        <div style={{ textAlign: "center", padding: "40px 20px" }}>
          <Spin size="large" />
          <div style={{ marginTop: 16, color: "var(--semi-color-text-1)" }}>
            正在搜索资源...
          </div>
        </div>
      </Card>
    );
  }

  // 错误状态
  if (error) {
    return (
      <Card style={{ borderRadius: 8 }}>
        <Empty
          description={error}
          style={{ color: "var(--semi-color-text-1)" }}
        />
      </Card>
    );
  }

  // 没有数据
  if (!data) {
    return null;
  }

  // 渲染合并后的结果（按网盘类型分组）
  if (hasMergedData(data)) {
    console.log("Raw merged_by_type:", data.merged_by_type);

    const cloudTypes = Object.keys(data.merged_by_type).filter(
      (type) =>
        type &&
        type !== "undefined" &&
        type !== "null" &&
        type.trim() !== "" &&
        data.merged_by_type[type] &&
        Array.isArray(data.merged_by_type[type])
    );

    console.log("Filtered cloudTypes:", cloudTypes);

    const totalResults = getTotalResults();

    if (!activeTab && cloudTypes.length > 0) {
      const firstValidTab = cloudTypes[0];
      console.log("Setting active tab to:", firstValidTab);
      setActiveTab(firstValidTab);
    } else if (activeTab && !cloudTypes.includes(activeTab)) {
      console.log("Active tab not in valid list, resetting to:", cloudTypes[0]);
      setActiveTab(cloudTypes[0]);
    }

    return (
      <div>
        {/* 结果统计头部 */}
        <Card style={{ marginBottom: 16, borderRadius: 8 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Title
              heading={4}
              style={{
                margin: 0,
                color: "var(--semi-color-text-0)",
                fontWeight: 600,
              }}
            >
              搜索结果
            </Title>
            <Tag
              color="green"
              style={{
                borderRadius: 8,
                fontWeight: 600,
                fontSize: 14,
              }}
            >
              共找到 {totalResults} 个结果
            </Tag>
          </div>
        </Card>

        {/* Tab布局 */}
        <Card style={{ borderRadius: 8 }}>
          <Tabs activeKey={activeTab || ""} onChange={setActiveTab} type="card">
            {cloudTypes
              .filter((cloudType) => {
                if (
                  !cloudType ||
                  cloudType === "undefined" ||
                  cloudType === "null" ||
                  cloudType.trim() === ""
                ) {
                  console.log("Filtering out invalid cloudType:", cloudType);
                  return false;
                }

                const resources = data.merged_by_type[cloudType];
                if (
                  !resources ||
                  !Array.isArray(resources) ||
                  resources.length === 0
                ) {
                  console.log(
                    "Filtering out cloudType with no resources:",
                    cloudType
                  );
                  return false;
                }

                return true;
              })
              .map((cloudType, index) => {
                const resources = data.merged_by_type[cloudType];
                const cloudTypeName =
                  CLOUD_TYPES[cloudType as keyof typeof CLOUD_TYPES] ||
                  cloudType;

                return (
                  <TabPane
                    tab={
                      <span>
                        {cloudTypeName}
                        <Tag
                          color="blue"
                          style={{
                            marginLeft: 8,
                            borderRadius: 4,
                          }}
                        >
                          {resources.length}
                        </Tag>
                      </span>
                    }
                    itemKey={cloudType}
                  >
                    <div style={{ padding: "20px 0" }}>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "16px",
                        }}
                      >
                        {resources.map((resource, resourceIndex) =>
                          renderResourceCard(resource, cloudType, resourceIndex)
                        )}
                      </div>
                    </div>
                  </TabPane>
                );
              })}
          </Tabs>
        </Card>
      </div>
    );
  }

  // 渲染原始结果数据
  if (hasResultsData(data)) {
    return (
      <div>
        <Card style={{ marginBottom: 16, borderRadius: 8 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Title
              heading={4}
              style={{
                margin: 0,
                color: "var(--semi-color-text-0)",
                fontWeight: 600,
              }}
            >
              搜索结果
            </Title>
            <Tag
              color="green"
              style={{
                borderRadius: 8,
                fontWeight: 600,
                fontSize: 14,
              }}
            >
              {data.results.length} 个结果
            </Tag>
          </div>
        </Card>
        <Card style={{ borderRadius: 8 }}>
          <div style={{ padding: "20px" }}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "16px",
              }}
            >
              {data.results.map((result, index) => (
                <Card
                  key={`result-${index}`}
                  style={{
                    marginBottom: 12,
                    borderRadius: 8,
                  }}
                  bodyStyle={{ padding: 16 }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 12,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        gap: 12,
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <Text
                          strong
                          style={{
                            fontSize: 16,
                            color: "var(--semi-color-text-0)",
                            display: "block",
                            marginBottom: 8,
                          }}
                        >
                          {result.title}
                        </Text>
                        <Text
                          style={{
                            color: "var(--semi-color-text-1)",
                            fontSize: 14,
                            lineHeight: 1.5,
                          }}
                        >
                          {result.content}
                        </Text>
                      </div>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                      }}
                    >
                      <Text
                        style={{
                          color: "var(--semi-color-text-2)",
                          fontSize: 12,
                        }}
                      >
                        {formatDateTime(result.datetime)}
                      </Text>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </Card>
      </div>
    );
  }

  // 空状态
  return (
    <Card style={{ borderRadius: 8 }}>
      <Empty
        description="未找到相关资源"
        style={{ color: "var(--semi-color-text-1)" }}
      />
    </Card>
  );
};

export default SearchResults;
