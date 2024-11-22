import { createCoreContext, fallbackWithLocaleChain } from "@intlify/core-base";
import { createI18n, type I18n } from "vue-i18n";

import type en from "~/assets/_locales/en.json";

import { userConfig } from "./storage";

const FALLBACK_LOCALE = "en";

export const SUPPORT_LOCALES = [FALLBACK_LOCALE] as const;

export type SupportLocale = typeof SUPPORT_LOCALES[number];

export function getLocaleWithFallback(locale: string): SupportLocale {
  const fallbackChain = fallbackWithLocaleChain(
    createCoreContext({}),
    FALLBACK_LOCALE,
    locale,
  );
  const supportLocaleSet = new Set<string>(SUPPORT_LOCALES);
  const baseLocale = fallbackChain.find((locale): locale is SupportLocale => supportLocaleSet.has(locale));
  return baseLocale ?? FALLBACK_LOCALE;
}

type MessageSchema = typeof en;

export async function setupI18n() {
  const defaultLocale = (await userConfig.getValue()).interfaceLanguage;
  const i18n = createI18n<[MessageSchema], SupportLocale>({
    locale: defaultLocale,
    fallbackLocale: FALLBACK_LOCALE,
    legacy: false,
  });
  // @ts-expect-error https://github.com/intlify/vue-i18n/discussions/2022
  await setI18nLanguage(i18n, defaultLocale);
  return i18n;
}

export async function setI18nLanguage(i18n: I18n, locale: SupportLocale) {
  // @ts-expect-error https://github.com/intlify/vue-i18n/issues/1003
  i18n.global.locale.value = locale;

  await userConfig.setValue({ interfaceLanguage: locale });
  document.documentElement.setAttribute("lang", locale);
  await loadLocaleMessages(i18n, locale);
}

async function loadLocaleMessages(i18n: I18n, locale: SupportLocale) {
  const messages = await import(
    `~/assets/_locales/${locale}.json`
  );

  i18n.global.setLocaleMessage(locale, messages.default);

  return nextTick();
}
