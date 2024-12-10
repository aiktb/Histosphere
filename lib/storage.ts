import type { SupportLocale } from "./i18n";
import { produce } from "immer";
import { getLocaleWithFallback } from "./i18n";

export interface UserConfig {
  interfaceLanguage: SupportLocale;
}

const rawUserConfig = storage.defineItem<UserConfig>("sync:userConfig", {
  init: () => ({
    interfaceLanguage: getLocaleWithFallback(chrome.i18n.getUILanguage()),
  }),
});

export const userConfig = {
  ...rawUserConfig,
  async setValue(updater: (draft: UserConfig) => void) {
    const currentValue = await rawUserConfig.getValue();
    const nextValue = produce(currentValue, updater);

    rawUserConfig.setValue(nextValue);
  },
};

export interface FilterRule {
  glob: string;
  enabled: boolean;
  applyTo: "url" | "title";
}

// The quota of `chrome.storage` is for a single key.
// Defining the growable ruleset as a separate storage item can maximize the use of quota
const rawFilterRuleset = storage.defineItem<FilterRule[]>("sync:filterRuleset", {
  init: () => {
    // Mock data for development, will be removed in production
    if (import.meta.env.DEV) {
      return [
        { glob: "https://translate.google.com/*", applyTo: "url", enabled: true },
        { glob: "*porn*", applyTo: "title", enabled: true },
      ];
    }

    return [];
  },
});

export const filterRuleset = {
  ...rawFilterRuleset,
  async setValue(updater: (draft: FilterRule[]) => void) {
    const currentValue = await rawFilterRuleset.getValue();
    const nextValue = produce(currentValue, updater);

    rawFilterRuleset.setValue(nextValue);
  },
};
