import { addDeletion, removeVisitByUrl } from "@/lib/db";

import { Temporal } from "@js-temporal/polyfill";

export default function registerOnHistoryVisitRemoved() {
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
}
