// src/App.tsx
import React, { useState, useEffect } from "react";
import { Layout, Typography, Toast, Spin } from "@douyinfe/semi-ui";
import { IconMenu, IconSearch } from "@douyinfe/semi-icons";
import SearchForm from "./components/SearchForm/SearchForm";
import SearchResults from "./components/SearchResults/SearchResults";
import SearchConfig, {
  SearchConfigType,
} from "./components/SearchConfig/SearchConfig";
import ThemeToggle from "./components/ThemeToggle/ThemeToggle";
import GitHubLink from "./components/GitHubLink/GitHubLink";
import { ThemeProvider, useTheme } from "./contexts/ThemeContext";
import { searchResources, checkHealth } from "./services/api";
import { SearchParams, SearchResponse, CLOUD_TYPES } from "./types";
import { config } from "./config";

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

const AppContent: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [searchData, setSearchData] = useState<SearchResponse | undefined>();
  const [apiStatus, setApiStatus] = useState<
    "healthy" | "unhealthy" | "unknown"
  >("unknown");
  const [keyword, setKeyword] = useState("");
  const [siderCollapsed, setSiderCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [searchConfig, setSearchConfig] = useState<SearchConfigType>({
    resultType: "merge",
    sourceType: "all",
    cloudTypes: Object.keys(CLOUD_TYPES), // 默认选择所有网盘类型
    refresh: false,
  });
  const { theme: currentTheme } = useTheme();

  // 监听屏幕尺寸变化
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      // 移动端默认收起边栏
      if (mobile && !siderCollapsed) {
        setSiderCollapsed(true);
      }
    };

    window.addEventListener("resize", handleResize);
    // 初始化时检查
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, [siderCollapsed]);

  // 检查API健康状态
  useEffect(() => {
    const checkApiHealth = async () => {
      try {
        await checkHealth();
        setApiStatus("healthy");
      } catch (err) {
        setApiStatus("unhealthy");
      }
    };
    checkApiHealth();
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
      Toast.error("请输入搜索关键词");
      return;
    }

    setLoading(true);
    setError(undefined);
    setSearchData(undefined);

    try {
      // 合并搜索参数和配置
      const searchParams: SearchParams = {
        ...params,
        res: searchConfig.resultType,
        src: searchConfig.sourceType,
        refresh: searchConfig.refresh,
      };

      if (searchConfig.cloudTypes.length > 0) {
        searchParams.cloud_types = searchConfig.cloudTypes;
      }

      const data = await searchResources(searchParams);
      setSearchData(data);
      console.log("API返回数据:", data);

      const totalResults = getTotalResults(data);
      if (totalResults === 0) {
        Toast.info("未找到相关资源");
      } else {
        Toast.success(`找到 ${totalResults} 个结果`);
      }
    } catch (err) {
      console.error("搜索失败:", err);
      setError(err instanceof Error ? err.message : "搜索失败，请稍后重试");
      Toast.error("搜索失败，请稍后重试");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* 顶部Header区域 */}
      <Header
        style={{
          backgroundColor: "var(--semi-color-nav-bg)",
          borderBottom: "1px solid var(--semi-color-border)",
          padding: "0 24px",
          height: 64,
          lineHeight: "64px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div
              style={{ cursor: "pointer", fontSize: 18 }}
              onClick={() => setSiderCollapsed(!siderCollapsed)}
            >
              <IconMenu />
            </div>
            <Title
              level={3}
              style={{ margin: 0, color: "var(--semi-color-text-0)" }}
            >
              {config.appName}
            </Title>
          </div>

          {/* 搜索表单放在Header */}
          <div
            style={{
              flex: 1,
              maxWidth: isMobile ? 300 : 600,
              margin: isMobile ? "0 12px" : "0 24px",
            }}
          >
            <SearchForm
              onSearch={handleSearch}
              loading={loading}
              keyword={keyword}
              setKeyword={setKeyword}
            />
          </div>

          {/* 右侧按钮组 */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {/* GitHub 链接 */}
            <GitHubLink />
            {/* 主题切换按钮 */}
            <ThemeToggle />
          </div>
        </div>
      </Header>

      <Layout>
        {/* 左侧边栏 */}
        <Sider
          collapsed={siderCollapsed}
          width={280}
          collapsedWidth={isMobile ? 0 : 80}
          style={{
            backgroundColor: "var(--semi-color-nav-bg)",
            borderRight: "1px solid var(--semi-color-border)",
            overflow: "auto",
            position: isMobile ? "fixed" : "relative",
            zIndex: isMobile ? 999 : "auto",
            height: isMobile ? "100vh" : "auto",
            top: isMobile ? 0 : "auto",
            left: isMobile ? (siderCollapsed ? -280 : 0) : "auto",
            transition: isMobile ? "left 0.3s ease" : "width 0.3s ease",
            boxShadow:
              isMobile && !siderCollapsed
                ? "2px 0 8px rgba(0, 0, 0, 0.15)"
                : "none",
          }}
        >
          {!siderCollapsed && <SearchConfig onConfigChange={setSearchConfig} />}
        </Sider>

        {/* 移动端遮罩层 */}
        {isMobile && !siderCollapsed && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.3)",
              zIndex: 998,
            }}
            onClick={() => setSiderCollapsed(true)}
          />
        )}

        {/* 主要内容区域 */}
        <Content
          style={{
            padding: 24,
            backgroundColor: "var(--semi-color-bg-1)",
            overflow: "auto",
          }}
        >
          {/* API状态警告 */}
          {apiStatus === "unhealthy" && (
            <div
              style={{
                padding: "12px 16px",
                backgroundColor: "var(--semi-color-warning-light-default)",
                border: "1px solid var(--semi-color-warning-light-active)",
                borderRadius: 6,
                marginBottom: 16,
                color: "var(--semi-color-warning)",
              }}
            >
              ⚠️ API 服务可能不可用，搜索结果可能受到影响
            </div>
          )}

          {/* 搜索结果 */}
          <SearchResults data={searchData} loading={loading} error={error} />
        </Content>
      </Layout>
    </Layout>
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
