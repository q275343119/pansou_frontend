import React, { useState, useEffect } from "react";
import {
  Layout,
  Typography,
  Button,
  message,
  theme,
  ConfigProvider,
} from "antd";
import SearchForm from "./components/SearchForm/SearchForm";
import SearchResults from "./components/SearchResults/SearchResults";
import ThemeToggle from "./components/ThemeToggle/ThemeToggle";
import { ThemeProvider, useTheme } from "./contexts/ThemeContext";
import { searchResources, checkHealth } from "./services/api";
import { SearchParams, SearchResponse } from "./types";

const { Content } = Layout;

const AppContent: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [searchData, setSearchData] = useState<SearchResponse | undefined>();
  const [apiStatus, setApiStatus] = useState<
    "healthy" | "unhealthy" | "unknown"
  >("unknown");
  const { theme: currentTheme } = useTheme();

  // 检查API健康状态
  useEffect(() => {
    const checkHealth = async () => {
      try {
        await checkHealth();
        setApiStatus("healthy");
      } catch (err) {
        setApiStatus("unhealthy");
      }
    };
    checkHealth();
  }, []);

  const getTotalResults = (data: SearchResponse) => {
    if (typeof data.total === "number") {
      return data.total;
    }
    if ("merged_by_type" in data && data.merged_by_type) {
      return Object.values(data.merged_by_type).reduce((total, resources) => {
        return total + (resources ? resources.length : 0);
      }, 0);
    }
    return 0;
  };

  const handleSearch = async (params: SearchParams) => {
    if (!params.kw.trim()) {
      message.error("请输入搜索关键词");
      return;
    }

    setLoading(true);
    setError(undefined);
    setSearchData(undefined);

    try {
      const data = await searchResources(params);
      setSearchData(data);
      console.log("API返回数据:", data);

      const totalResults = getTotalResults(data);
      if (totalResults === 0) {
        message.info("未找到相关资源");
      } else {
        message.success(`找到 ${totalResults} 个结果`);
      }
    } catch (err) {
      console.error("搜索失败:", err);
      setError(err instanceof Error ? err.message : "搜索失败，请稍后重试");
      message.error("搜索失败，请稍后重试");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#ff2442",
          borderRadius: 8,
        },
        algorithm:
          currentTheme === "dark"
            ? theme.darkAlgorithm
            : theme.defaultAlgorithm,
      }}
    >
      <Layout style={{ minHeight: "100vh" }}>
        {/* 主要内容区域 */}
        <Content
          style={{
            padding: "24px",
            maxWidth: 1200,
            margin: "0 auto",
            width: "100%",
            backgroundColor: currentTheme === "dark" ? "#141414" : "#f5f5f5",
          }}
        >
          {/* 主题切换按钮 - 移到右上角 */}
          <div
            style={{
              position: "fixed",
              top: "16px",
              right: "16px",
              zIndex: 1000,
            }}
          >
            <ThemeToggle />
          </div>

          {/* API状态警告 */}
          {apiStatus === "unhealthy" && (
            <div
              style={{
                padding: "12px 16px",
                backgroundColor: "#fff2e8",
                border: "1px solid #ffbb96",
                borderRadius: 8,
                marginBottom: 16,
                color: "#d46b08",
              }}
            >
              ⚠️ API 服务可能不可用，搜索结果可能受到影响
            </div>
          )}

          {/* 搜索表单 */}
          <SearchForm onSearch={handleSearch} loading={loading} />

          {/* 搜索结果 */}
          <div style={{ marginTop: 24 }}>
            <SearchResults data={searchData} loading={loading} error={error} />
          </div>
        </Content>
      </Layout>
    </ConfigProvider>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
};

export default App;
