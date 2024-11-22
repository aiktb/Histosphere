import autoprefixer from "autoprefixer";
import tailwind from "tailwindcss";

import svgr from "vite-plugin-svgr";
import { defineConfig } from "wxt";

// See https://wxt.dev/api/config.html
export default defineConfig({
  extensionApi: "chrome",
  manifest: {
    name: "Auto-delete & Analyze History - Histosphere",
    description: "Browser history enhancements, fine-grained control, and behavioral analysis.",
    version: "0.0.1",
    permissions: ["storage", "history"],
    incognito: "not_allowed",
  },
  modules: ["@wxt-dev/module-vue", "@wxt-dev/auto-icons"],
  imports: {
    presets: ["vue-i18n", "vue"],
  },
  autoIcons: {
    baseIconPath: "assets/logo.png",
  },
  vite: () => ({
    css: {
      postcss: {
        plugins: [tailwind, autoprefixer],
      },
    },
    plugins: [svgr()],
  }),
});
