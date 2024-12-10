import autoprefixer from "autoprefixer";
import tailwind from "tailwindcss";
import vueRouter from "unplugin-vue-router/vite";
import svgr from "vite-plugin-svgr";
import vueDevtools from "vite-plugin-vue-devtools";
import { defineConfig } from "wxt";
import { homepage } from "./package.json";

// See https://wxt.dev/api/config.html
export default defineConfig({
  extensionApi: "chrome",
  manifest: {
    name: "Perfect History",
    description: "Browser history enhancements, fine-grained control, and behavioral analysis.",
    homepage_url: homepage,
    permissions: ["storage", "history", "contextMenus"],
    incognito: "not_allowed",
    action: {
      default_title: "Perfect History",
    },
    commands: {
      _execute_action: {
        suggested_key: {
          default: "Ctrl+Shift+H",
          mac: "Command+Shift+H",
        },
      },
    },
  },
  modules: ["@wxt-dev/module-vue", "@wxt-dev/auto-icons"],
  imports: {
    presets: ["vue", "vue-i18n"],
  },
  autoIcons: {
    baseIconPath: "assets/logo.png",
    grayscaleOnDevelopment: false,
  },
  hooks: {
    "prepare:types": async (_, entries) => {
      entries.push({
        module: "./types/vue-router.d.ts",
      });
    },
    // https://github.com/wxt-dev/wxt/issues/533
    "vite:devServer:extendConfig": (config) => {
      config.plugins?.push(vueDevtools({
        appendTo: "/entrypoints/options/main.ts",
      }));
    },
  },
  vite: () => ({
    css: {
      postcss: {
        plugins: [tailwind, autoprefixer],
      },
    },
    plugins: [
      vueRouter({
        routesFolder: [{
          src: "./entrypoints/options/pages",
        }],
        dts: "./.wxt/types/vue-router.d.ts",
      }),
      svgr(),
    ],
  }),
});
