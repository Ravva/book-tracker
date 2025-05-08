import React from 'react';
import { Button, Tooltip } from 'antd';
import { MoonOutlined, SunOutlined } from '@ant-design/icons';

interface ThemeToggleProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

export default function ThemeToggle({ isDarkMode, toggleTheme }: ThemeToggleProps) {
  return (
    <Tooltip
      title={isDarkMode ? 'Переключить на светлую тему' : 'Переключить на темную тему'}
      placement="left"
    >
      <Button
        type="primary"
        icon={isDarkMode ? <SunOutlined /> : <MoonOutlined />}
        onClick={toggleTheme}
        shape="circle"
        size="large"
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 1000,
          width: '44px',
          height: '44px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '18px',
          boxShadow: '0 6px 16px -8px rgba(0, 0, 0, 0.08), 0 9px 28px 0 rgba(0, 0, 0, 0.05), 0 12px 48px 16px rgba(0, 0, 0, 0.03)',
          opacity: 0.9,
          transition: 'all 0.3s',
        }}
        aria-label="Переключить тему"
      />
    </Tooltip>
  );
}
