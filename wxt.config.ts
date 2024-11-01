import autoprefixer from "autoprefixer";
import tailwind from "tailwindcss";
import svgr from "vite-plugin-svgr";
import { defineConfig } from "wxt";

// See https://wxt.dev/api/config.html
export default defineConfig({
  extensionApi: "chrome",
  manifest: {
    version: "0.0.1",
  },
  modules: ["@wxt-dev/module-vue", "@wxt-dev/auto-icons"],
  imports: {
    presets: ["vue"],
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
