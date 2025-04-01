<template>
  <v-card
    v-if="store.marqueeTexts.length > 0"
    color="transparent"
    elevation="0"
    rounded="0"
  >
    <NuxtMarquee pause-on-hover pause-on-click autoFill>
      <div v-for="(marqueeText, index) in store.marqueeTexts" :key="index">
        <!-- display text and add link to it -->
        <div
          :class="[
            index % 2 === 0 ? 'text-primary' : 'text-secondary',
            'mx-8 font-weight-bold text-h6',
          ]"
          @click="openLink(marqueeText.link)"
          style="cursor: pointer"
        >
          {{ marqueeText.name }}
        </div>
      </div>
    </NuxtMarquee>
  </v-card>
</template>

<script setup>
import { appStore } from "~/stores/AppStore";

const store = appStore();

const openLink = (link) => {
  if (link) {
    window.open(link, "_blank");
  }
};
</script>
