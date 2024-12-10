export default function registerOnActionClicked() {
  browser.action.onClicked.addListener(() => {
    browser.runtime.openOptionsPage();
  });
}
