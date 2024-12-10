import registerOnActionClicked from "./listeners/onActionClicked";
import registerOnHistoryVisited from "./listeners/onHistoryVisited";
import registerOnHistoryVisitRemoved from "./listeners/onHistoryVisitRemoved";
import registerOnInstall from "./listeners/onInstall";

export default defineBackground({
  type: "module",
  main() {
    registerOnInstall();
    registerOnActionClicked();
    registerOnHistoryVisitRemoved();
    registerOnHistoryVisited();
  },
});
