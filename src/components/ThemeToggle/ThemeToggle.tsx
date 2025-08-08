import React from 'react';
import { Button } from '@douyinfe/semi-ui';
import { IconSun, IconMoon } from '@douyinfe/semi-icons';
import { useTheme } from '../../contexts/ThemeContext';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      icon={theme === 'light' ? <IconMoon /> : <IconSun />}
      onClick={toggleTheme}
      type="tertiary"
      theme="borderless"
      size="small"
      aria-label={`切换到${theme === 'light' ? '暗色' : '亮色'}主题`}
    />
  );
};

export default ThemeToggle; 