import { addDeletion, putVisit, removeVisitByUrl, type VisitRecord } from "@/lib/db";
import { filterRuleset } from "@/lib/storage";

import { Temporal } from "@js-temporal/polyfill";
import picomatch, { type Matcher } from "picomatch";

export default defineBackground({
  type: "module",
  main() {
    browser.history.onVisited.addListener(async (historyItem) => {
      if (!isValidHistoryItem(historyItem)) {
        return;
      }

      if (await isFilteredHistoryItem(historyItem)) {
        browser.history.deleteUrl({ url: historyItem.url });
        addDeletion({
          deleteTime: Temporal.Now.instant().epochMilliseconds,
          type: "auto",
        });
        return;
      }

      // Must use `put`, id in items returned by `chrome.history.onVisited` are not unique.
      // For example, refreshing the page will trigger `onVisited` twice, and the item id is the same.
      putVisit(historyItem);
    });

    // Question: When does `undefined` actually appear? I have never seen it.
    function isValidHistoryItem(historyItem: chrome.history.HistoryItem): historyItem is VisitRecord {
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

    async function isFilteredHistoryItem(historyItem: VisitRecord) {
      const { isUrlMatch, isTitleMatch } = await getMatcher();
      return isUrlMatch(historyItem.url) || isTitleMatch(historyItem.title);
    }

    interface RuleMatcher {
      isUrlMatch: Matcher;
      isTitleMatch: Matcher;
    }
    // Cache, no need to traverse ruleset to create Matcher instance every time it is called,
    // watch storage handles cache expiration.
    let ruleMather: RuleMatcher | null = null;
    filterRuleset.watch(updateMatcher);
    async function getMatcher() {
      if (ruleMather === null) {
        await updateMatcher();
      }

      return ruleMather!;
    }

    async function updateMatcher() {
      const rules = await filterRuleset.getValue();
      ruleMather = {
        isUrlMatch: picomatch(rules.filter(rule => rule.applyTo === "url").map(rule => rule.glob)),
        isTitleMatch: picomatch(rules.filter(rule => rule.applyTo === "title").map(rule => rule.glob)),
      };
    }

    browser.history.onVisitRemoved.addListener((removedResult) => {
      if (removedResult.urls === undefined) {
        return;
      }
      for (const url of removedResult.urls) {
        addDeletion({
          deleteTime: Temporal.Now.instant().epochMilliseconds,
          type: "manual",
        });
        removeVisitByUrl(url);
      }
    });
  },
});
