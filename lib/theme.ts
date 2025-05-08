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
  },
  components: {
    Button: {
      colorPrimary: '#1677ff',
      algorithm: true,
    },
    Card: {
      colorBgContainer: '#ffffff',
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
  },
  components: {
    Button: {
      colorPrimary: '#1668dc',
      algorithm: true,
    },
    Card: {
      colorBgContainer: '#141414',
    },
  },
};

// Функция для получения темы в зависимости от режима
export const getTheme = (isDark: boolean): ThemeConfig => {
  return isDark ? darkTheme : lightTheme;
};
