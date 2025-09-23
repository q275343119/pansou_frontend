// src/components/GitHubLink/GitHubLink.tsx
import React from "react";
import { Button } from "@douyinfe/semi-ui";
import { IconGithubLogo } from "@douyinfe/semi-icons";
import { config } from "../../config";

const GitHubLink: React.FC = () => {
  // 如果没有配置GitHub仓库地址，则不显示组件
  if (!config.gitRepoUrl) {
    return null;
  }

  const handleClick = () => {
    // 在新标签页中打开GitHub仓库
    window.open(config.gitRepoUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <Button
      theme="borderless"
      icon={<IconGithubLogo />}
      onClick={handleClick}
      style={{
        borderRadius: "50%",
        width: 40,
        height: 40,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "var(--semi-color-text-1)",
      }}
      title="查看源代码"
    />
  );
};

export default GitHubLink;
