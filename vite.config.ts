import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/BSU_laddergame/', // GitHub 레포지토리 이름으로 설정
})
