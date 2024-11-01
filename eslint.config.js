// @ts-check
import antfu from "@antfu/eslint-config";
import tailwind from "eslint-plugin-tailwindcss";

export default antfu({
  stylistic: {
    quotes: "double",
    semi: true,
  },
}).append(...tailwind.configs["flat/recommended"], {
  rules: {
    "tailwindcss/no-custom-classname": "off",
  },
});
