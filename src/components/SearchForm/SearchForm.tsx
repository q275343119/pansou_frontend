// src/components/SearchForm/SearchForm.tsx
import React, { useState } from "react";
import { Input, Button } from "@douyinfe/semi-ui";
import { IconSearch } from "@douyinfe/semi-icons";
import { SearchParams } from "../../types";

interface SearchFormProps {
  onSearch: (params: SearchParams) => void;
  loading?: boolean;
  keyword?: string;
  setKeyword?: (keyword: string) => void;
}

const SearchForm: React.FC<SearchFormProps> = ({
  onSearch,
  loading = false,
  keyword: propKeyword,
  setKeyword: propSetKeyword,
}) => {
  const [internalKeyword, setInternalKeyword] = useState("");

  // 使用外部传入的keyword和setKeyword，如果没有则使用内部状态
  const keyword = propKeyword ?? internalKeyword;
  const setKeyword = propSetKeyword ?? setInternalKeyword;

  const handleSearch = () => {
    if (!keyword.trim()) {
      return;
    }

    const searchParams: SearchParams = {
      kw: keyword,
      res: "merge", // 默认按类型合并，配置项会在Sider中
      src: "all", // 默认全部来源，配置项会在Sider中
      refresh: false, // 默认不刷新，配置项会在Sider中
    };

    onSearch(searchParams);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div
      style={{ display: "flex", gap: 8, alignItems: "center", width: "100%" }}
    >
      <Input
        placeholder="输入搜索关键词..."
        value={keyword}
        onChange={(value) => setKeyword(value)}
        onKeyPress={handleKeyPress}
        prefix={<IconSearch style={{ color: "var(--semi-color-text-2)" }} />}
        style={{
          borderRadius: 6,
          flex: 1,
        }}
      />
      <Button
        theme="solid"
        type="primary"
        loading={loading}
        onClick={handleSearch}
        icon={<IconSearch />}
        style={{
          borderRadius: 6,
        }}
      >
        搜索
      </Button>
    </div>
  );
};

export default SearchForm;
