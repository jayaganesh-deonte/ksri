<template>
  <v-system-bar>
    <NuxtMarquee pause-on-hover pause-on-click autoFill>
      <div v-for="(marqueeText, index) in marqueeTexts" :key="index">
        <!-- display text and add link to it -->
        <NuxtLink
          :to="marqueeText.link"
          class="mx-8"
          style="text-decoration: unset"
        >
          <div class="text-primary mx-8 font-weight-bold text-h6">
            {{ marqueeText.name }}
          </div>
        </NuxtLink>
      </div>
    </NuxtMarquee>
  </v-system-bar>
</template>

<script setup>
const marqueeTexts = [
  {
    name: "Know about our upcoming events",
    link: "/events",
  },
  {
    name: "Click here Contribute Now!!!",
    link: "/contribute",
  },
];
</script>
