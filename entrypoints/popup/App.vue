<script lang="ts" setup>
import { Button } from "~/components/ui/button";

const count = ref(0);
</script>

<template>
  <div class="flex h-full flex-col items-center justify-center">
    <div class="flex size-10 items-center justify-center font-mono text-lg font-bold">
      "{{ count }}"
    </div>
    <Button size="sm" @click="count++">
      <span>Clink me</span>
    </Button>
  </div>
</template>
