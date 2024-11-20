import autoprefixer from "autoprefixer";
import tailwind from "tailwindcss";

import svgr from "vite-plugin-svgr";
import { defineConfig } from "wxt";

// See https://wxt.dev/api/config.html
export default defineConfig({
  extensionApi: "chrome",
  manifest: {
    name: "Histosphere",
    description: "Browser history enhancements, fine-grained control, and behavioral analysis.",
    version: "0.0.1",
    permissions: ["storage", "history"],
  },
  modules: ["@wxt-dev/module-vue", "@wxt-dev/auto-icons"],
  imports: {
    presets: ["vue-i18n", "vue"],
  },
  autoIcons: {
    baseIconPath: "assets/wxt.svg",
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
