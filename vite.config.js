import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
    plugins: [tailwindcss(), reactRouter(), tsconfigPaths()],

    server: {
        port: 5173,
        // Определяем базовый url для API
        define: {
            "import.meta.env.VITE_API_URL": JSON.stringify(
                process.env.VITE_API_URL || "",
            ),
        },
    },
});
