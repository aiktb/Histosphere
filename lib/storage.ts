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

export interface FilterRule {
  glob: string;
  enabled: boolean;
  applyTo: "url" | "title";
}

// The quota of `chrome.storage` is for a single key.
// Defining the growable ruleset as a separate storage item can maximize the use of quota
export const filterRuleset = storage.defineItem<FilterRule[]>("sync:filterRuleset", {
  init: () => {
    if (import.meta.env.DEV) {
      return [
        { glob: "https://translate.google.com/*", applyTo: "url", enabled: true },
        { glob: "*hentai*", applyTo: "title", enabled: true },
      ];
    }

    return [];
  },
});
