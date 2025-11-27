import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ command }) => ({
  plugins: [react()],
  // 只有 build 部署到 GitHub Pages 时才使用 /recorder/
  base: command === 'build' ? '/recorder/' : '/',
}))
