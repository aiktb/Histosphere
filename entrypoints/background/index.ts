import { type HistoryItem, putHistoryItem } from "@/lib/db";

export default defineBackground({
  type: "module",
  main() {
    browser.history.onVisited.addListener((historyItem) => {
      if (!isValidHistoryItem(historyItem)) {
        return;
      }

      if (historyItem.url.includes("translate.google.com")) {
        browser.history.deleteUrl({ url: historyItem.url });
      } else {
        // Must use `put`, id in items returned by `chrome.history.onVisited` are not unique.
        // For example, refreshing the page will trigger `onVisited` twice, and the item id is the same.
        putHistoryItem(historyItem);
      }
    });
  },
});

function isValidHistoryItem(historyItem: chrome.history.HistoryItem): historyItem is HistoryItem {
  return historyItem.lastVisitTime !== undefined
    && historyItem.url !== undefined
    && historyItem.visitCount !== undefined
    && historyItem.typedCount !== undefined
    && historyItem.title !== undefined
    /**
     * Dynamically updating `document.title` when opening a page will result in an `onVisited` event A with an empty title,
     * even if the page also triggers an `onVisited` event B with a complete title,
     * but sometimes event A will overwrite event B resulting in an invalid record.
     */
    && historyItem.title !== "";
}
