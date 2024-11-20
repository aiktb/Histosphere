<script lang="ts" setup>
const inoperable = ref(false);
const protocol = ref("");
const host = ref("");

const { t } = useI18n();
onMounted(async () => {
  const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
  const historyUrlRegex = /^(?<protocol>https?|chrome-extension):\/\//;
  const tabUrl = tab?.url
  if (!tabUrl) {
    inoperable.value = true;
    return;
  }
  const matchedProtocol = tabUrl.match(historyUrlRegex)?.groups?.protocol
  if (!matchedProtocol) {
    inoperable.value = true;
    return;
  }
  protocol.value = matchedProtocol;
  host.value = new URL(tabUrl).host;
});
</script>

<template>
  <div class="flex h-full flex-col items-center justify-center">
    <header class="">
      <div>{{ t("currentHost", { host }) }}</div>
    </header>
  </div>
</template>
