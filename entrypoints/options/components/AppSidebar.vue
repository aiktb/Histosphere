<script setup lang="ts">
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { homepage } from "@/package.json";

import { RouterLink } from "vue-router";

const navItems = [
  {
    title: "Dashboard",
    data: [
      {
        title: "Control",
        url: "/",
        icon: "i-lucide-square-terminal",
      },
      {
        title: "Trend",
        url: "/trend",
        icon: "i-lucide-bar-chart-4",
      },
      {
        title: "Activity",
        url: "/activity",
        icon: "i-lucide-calendar-days",
      },

    ],
  },
  {
    title: "More information",
    data: [
      {
        title: "Settings",
        url: "/settings",
        icon: "i-lucide-settings",
      },
      {
        title: "About",
        url: "/about",
        icon: "i-lucide-info",
      },
    ],
  },
];
</script>

<template>
  <Sidebar collapsible="icon">
    <SidebarHeader>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton
            as="a"
            size="lg"
            :href="homepage"
          >
            <div class="grid flex-1 text-left text-sm leading-tight">
              <span class="truncate font-semibold">Perfect History</span>
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>
    <SidebarContent>
      <SidebarGroup v-for="item of navItems" :key="item.title">
        <SidebarGroupLabel class="sr-only">
          {{ item.title }}
        </SidebarGroupLabel>
        <SidebarMenu>
          <SidebarMenuItem v-for="link of item.data" :key="link.title">
            <SidebarMenuButton :tooltip="item.title" :as="RouterLink" :to="link.url">
              <i :class="cn('size-4 shrink-0', link.icon)" />
              <span class="font-medium">{{ link.title }}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroup>
    </SidebarContent>
    <SidebarRail />
  </Sidebar>
</template>
