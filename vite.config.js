import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
    plugins: [vue()],
    base: '/VueNew/', // Убедитесь что путь правильный!
    server: {
        port: 5173
    }
})