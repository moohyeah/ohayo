import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ mode }) => {
  // 通过 `mode` 获取当前的环境（如 'development' 或 'production'）
  const env = loadEnv(mode, process.cwd());

  return {
    base: env.VITE_BASE_URL,  // 通过 `env` 获取 .env 文件中的变量
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      port: env.VITE_PORT || 5173,  // 使用环境变量来配置端口
    },
  };
});