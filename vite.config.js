import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    modules: {
      localsConvention: 'camelCase', // 선택적: 클래스 이름을 camelCase로 변환
    },
  },
  base: '/cms/',
})
