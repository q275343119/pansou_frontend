// src/components/ThemeToggle/ThemeToggle.tsx
import React from "react";
import { Button, Tooltip } from "@douyinfe/semi-ui";
import { IconSun, IconMoon } from "@douyinfe/semi-icons";
import { useTheme } from "../../contexts/ThemeContext";

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Tooltip content={theme === "light" ? "切换到暗色主题" : "切换到亮色主题"}>
      <Button
        theme="borderless"
        icon={theme === "light" ? <IconMoon /> : <IconSun />}
        onClick={toggleTheme}
        style={{
          borderRadius: "50%",
          width: 40,
          height: 40,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--semi-color-text-1)",
        }}
      />
    </Tooltip>
  );
};

export default ThemeToggle;
