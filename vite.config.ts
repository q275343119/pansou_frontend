/*
 * @Author: 杨永乾
 * @Date: 2026-05-29 17:41:56
 * @Description:
 */
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import * as dotenv from 'dotenv'

// 使用 dotenv 加载 .env 文件
dotenv.config()

console.log('🔧 dotenv 加载后的 VITE_ 变量:')
Object.keys(process.env)
  .filter(key => key.startsWith('VITE_'))
  .forEach(key => {
    console.log(`${key}: ${process.env[key]}`)
  })

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: false,
    allowedHosts: [
      'https://pansou.oneplus1.top/' // 加上你的域名
      ],
      proxy: {
      '/api': {
        target: 'https://pansou.oneplus1.top', // 盘搜服务地址
        changeOrigin: true
      }
    }
  },
  define: {
    'import.meta.env.VITE_API_BASE_URL': JSON.stringify(process.env.VITE_API_BASE_URL || ''),
    'import.meta.env.VITE_APP_NAME': JSON.stringify(process.env.VITE_APP_NAME || '盘搜'),
    'import.meta.env.VITE_APP_VERSION': JSON.stringify(process.env.VITE_APP_VERSION || '1.0.0'),
    'import.meta.env.VITE_GIT_REPO_URL': JSON.stringify(process.env.VITE_GIT_REPO_URL || ''),
    'import.meta.env.MODE': JSON.stringify('development')
  }
})
