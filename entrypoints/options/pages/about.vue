<script setup lang="ts">

</script>

<template>
  <div>
    <img alt="Perfect History logo" src="@/assets/logo.svg" class="size-32">
    <h1>About</h1>
    <p>Version: {{ browser.runtime.getManifest().version }}</p>
  </div>
</template>
