import {defineConfig} from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
    build: {
        lib: {
            entry: "src/index.ts",
            name: "VueRenderTracker",
            fileName: (format) =>
                format === "iife"
                    ? "auto.global.js"
                    : `vue-render-tracker.${format}.js`,
            formats: ["es", "umd", "iife"], // Добавляем iife
        },
        rollupOptions: {
            external: ["vue"],
            output: {
                globals: {
                    vue: "Vue",
                },
            },
        },
    },
    plugins: [
        dts({
            insertTypesEntry: true,
            outDir: "dist/types",
        }),
    ],
});
