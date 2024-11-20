import type { SupportLocale } from "./i18n";
import { getLocaleWithFallback } from "./i18n";

export interface UserConfig {
  interfaceLanguage: SupportLocale;
}

export const userConfig = storage.defineItem<UserConfig>("sync:userConfig", {
  init: () => ({
    interfaceLanguage: getLocaleWithFallback(chrome.i18n.getUILanguage()),
  }),
});
