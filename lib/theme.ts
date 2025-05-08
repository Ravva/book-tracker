import { ThemeConfig } from 'antd';

// Светлая тема
export const lightTheme: ThemeConfig = {
  token: {
    colorPrimary: '#1677ff',
    colorSuccess: '#52c41a',
    colorWarning: '#faad14',
    colorError: '#ff4d4f',
    colorInfo: '#1677ff',
    borderRadius: 6,
    wireframe: false,
    // Обновленные значения для соответствия Ant Design 5.0
    colorBgContainer: '#ffffff',
    colorBgElevated: '#ffffff',
    colorBgLayout: '#f5f5f5',
    colorBorder: '#f0f0f0',
    colorTextBase: '#000000',
    colorTextSecondary: '#5c5c5c',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
    boxShadowSecondary: '0 1px 2px -2px rgba(0, 0, 0, 0.16), 0 3px 6px 0 rgba(0, 0, 0, 0.12), 0 5px 12px 4px rgba(0, 0, 0, 0.09)',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },
  components: {
    Button: {
      borderRadius: 6,
      controlHeight: 32,
      paddingContentHorizontal: 16,
    },
    Card: {
      colorBgContainer: '#ffffff',
      borderRadius: 8,
      boxShadow: '0 1px 2px rgba(0, 0, 0, 0.06)',
    },
    Table: {
      borderRadius: 8,
      colorBgContainer: '#ffffff',
    },
    Menu: {
      itemBg: 'transparent',
      itemColor: 'rgba(0, 0, 0, 0.85)',
      itemSelectedColor: '#1677ff',
      itemSelectedBg: '#e6f4ff',
      itemHoverColor: '#1677ff',
    },
    Layout: {
      headerBg: '#ffffff',
      bodyBg: '#f5f5f5',
      triggerBg: '#ffffff',
    },
  },
};

// Темная тема
export const darkTheme: ThemeConfig = {
  token: {
    colorPrimary: '#1668dc',
    colorSuccess: '#49aa19',
    colorWarning: '#d89614',
    colorError: '#d32029',
    colorInfo: '#1668dc',
    borderRadius: 6,
    wireframe: false,
    // Обновленные значения для соответствия Ant Design 5.0
    colorBgContainer: '#141414',
    colorBgElevated: '#1f1f1f',
    colorBgLayout: '#000000',
    colorBorder: '#303030',
    colorTextBase: '#ffffff',
    colorTextSecondary: '#a6a6a6',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.45)',
    boxShadowSecondary: '0 1px 2px -2px rgba(0, 0, 0, 0.48), 0 3px 6px 0 rgba(0, 0, 0, 0.36), 0 5px 12px 4px rgba(0, 0, 0, 0.27)',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },
  components: {
    Button: {
      borderRadius: 6,
      controlHeight: 32,
      paddingContentHorizontal: 16,
    },
    Card: {
      colorBgContainer: '#1f1f1f',
      borderRadius: 8,
      boxShadow: '0 1px 2px rgba(0, 0, 0, 0.16)',
    },
    Table: {
      borderRadius: 8,
      colorBgContainer: '#1f1f1f',
    },
    Menu: {
      itemBg: 'transparent',
      itemColor: 'rgba(255, 255, 255, 0.85)',
      itemSelectedColor: '#1668dc',
      itemSelectedBg: '#111b26',
      itemHoverColor: '#1668dc',
    },
    Layout: {
      headerBg: '#141414',
      bodyBg: '#000000',
      triggerBg: '#141414',
    },
  },
};

// Функция для получения темы в зависимости от режима
export const getTheme = (isDark: boolean): ThemeConfig => {
  return isDark ? darkTheme : lightTheme;
};
