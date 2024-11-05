import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { viteVConsole } from 'vite-plugin-vconsole';

export default defineConfig(({ mode }) => {
  // 通过 `mode` 获取当前的环境（如 'development' 或 'production'）
  const env = loadEnv(mode, process.cwd());

  return {
    base: env.VITE_BASE_URL,  // 通过 `env` 获取 .env 文件中的变量
    plugins: [
      react(),
      viteVConsole({
        entry: path.resolve('src/main.tsx'),
        enabled: true,
        config: {
          maxLogNumber: 1000,
          theme: 'dark'
        }
      })
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      port: env.VITE_PORT || 5173,  // 使用环境变量来配置端口
      host: "0.0.0.0",
      proxy: {
        '/api': {   // 假设 API 路径以 /api 开头
          target: env.API_BASE_URL || 'http://localhost:3000', // 后端服务器地址
          changeOrigin: true,             // 修改请求头的 Origin
          // rewrite: (path) => path.replace(/^\/api/, '') // 去除 /api 前缀
        }
      }
    },
    build : {
      rollupOptions: {
        output: {
          manualChunks(id) {
            // console.log("====manualChunks:" + id);
            if (id.includes('node_modules')) {
              if (id.includes('react')) {
                return 'react-vendor'; // 把 react 和 react-dom 拆成一个单独的 chunk
              }
              if (id.includes('aptos')) {
                return 'aptos-vendor'; // 把 react 和 react-dom 拆成一个单独的 chunk
              }
              if (id.includes('lodash') || id.includes('axios')) {
                return 'utility-vendor'; // 把 lodash 和 axios 拆成另一个 chunk
              }
              if (id.includes('poseidon')) {
                return 'poseidon-vendor'; // 把 react 和 react-dom 拆成一个单独的 chunk
              }
              console.log("====manualChunks:" + id);
              return 'vendor'; // 所有来自 node_modules 的模块将打包到 vendor chunk 中
            }
          },
        }
      }
    }
  };
});