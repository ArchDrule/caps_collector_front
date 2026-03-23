import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
    plugins: [tailwindcss(), reactRouter(), tsconfigPaths()],

    server: {
        port: 5173,
        // Прокси для API запросов в режиме разработки
        proxy: {
            "/api": {
                target: process.env.VITE_API_URL || "http://127.0.0.1:8000",
                changeOrigin: true,
            },
        },
    },
});
