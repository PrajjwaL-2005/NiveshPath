import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:5001", // ✅ backend port (fixed)
        changeOrigin: true,              // ✅ required
        secure: false,                   // ✅ fine for local dev
      },
    },
  },
});
