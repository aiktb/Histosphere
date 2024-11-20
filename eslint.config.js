// @ts-check
import antfu from "@antfu/eslint-config";
import vueI18n from "@intlify/eslint-plugin-vue-i18n";
import tailwind from "eslint-plugin-tailwindcss";

export default antfu({
  stylistic: {
    quotes: "double",
    semi: true,
  },
}, {
  // Remember to specify the file glob here, otherwise it might cause the vue plugin to handle non-vue files
  files: ["**/*.{ts,vue}"],
  rules: {
    "antfu/no-top-level-await": "off",
    "style/brace-style": ["error", "1tbs"],
  },
}).append(...tailwind.configs["flat/recommended"], {
  rules: {
    "tailwindcss/no-custom-classname": "off",
  },
}).append(
  ...vueI18n.configs["flat/recommended"],
  {
    settings: {
      "vue-i18n": {
        localeDir: "./assets/_locales/*.json",
        messageSyntaxVersion: "^9.0.0",
      },
    },
  },
);
