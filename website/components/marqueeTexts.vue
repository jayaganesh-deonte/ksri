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
        <NuxtLink :to="marqueeText.link" style="text-decoration: unset">
          <div class="text-primary mx-8 font-weight-bold text-h6">
            {{ marqueeText.name }}
          </div>
        </NuxtLink>
      </div>
    </NuxtMarquee>
  </v-card>
</template>

<script setup>
import { appStore } from "~/stores/AppStore";

const store = appStore();
</script>
