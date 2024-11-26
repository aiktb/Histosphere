import { setupI18n } from "~/lib/i18n";

import App from "./App.vue";

import "~/assets/index.css";

import "@fontsource/ubuntu-mono/400.css";
import "@fontsource/ubuntu-mono/700.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/700.css";

const i18n = await setupI18n();

createApp(App).use(i18n).mount("#app");
