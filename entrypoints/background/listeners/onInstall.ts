import { filterRuleset } from "@/lib/storage";

const contextMenuIds = {
  BLOCK_SITE_HISTORY: "blockSiteHistory",
  REMOVE_URL_HISTORY: "removeUrlHistory",
  VISIT_SITE_HISTORY: "visitSiteHistory",
} as const;

type ContextMenuId = (typeof contextMenuIds)[keyof typeof contextMenuIds];

export default function registerOnInstallClicked() {
  browser.runtime.onInstalled.addListener(() => {
    // Clear registered items to prevent errors caused by creating menu items multiple times.
    chrome.contextMenus.removeAll();
    const contextMenuItem: chrome.contextMenus.CreateProperties = {
      id: contextMenuIds.BLOCK_SITE_HISTORY,
      title: "Block this site from history",
      documentUrlPatterns: ["https://*/*", "http://*/*"],
    };
    chrome.contextMenus.create(contextMenuItem);

    browser.contextMenus.onClicked.addListener(async (info, tab) => {
      if (!tab?.url) {
        return;
      }
      const url = new URL(tab.url);
      switch (info.menuItemId as ContextMenuId) {
        case contextMenuIds.BLOCK_SITE_HISTORY:{
          const glob = `${url.origin}/*`;
          const blockedRule = (await filterRuleset.getValue()).find(rule => rule.glob === glob);
          if (!blockedRule) {
            filterRuleset.setValue((draft) => {
              draft.push({
                glob,
                enabled: true,
                applyTo: "url",
              });
            });
            return;
          }

          if (!blockedRule.enabled) {
            filterRuleset.setValue((draft) => {
              draft.find(rule => rule.glob === glob)!.enabled = true;
            });
          }
          break;
        }
      }
    });
  });
}
