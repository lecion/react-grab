import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import vue2 from "@vitejs/plugin-vue2";
import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react(), vue2(), tailwindcss()],
  server: {
    port: 5175,
    strictPort: true,
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        vue2: resolve(__dirname, 'vue2.html')
      }
    }
  },
  resolve: {
    alias: {
      "@": "/src",
    },
  },
});
