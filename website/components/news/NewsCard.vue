<template>
  <v-card
    class="pa-2 text-body-1 ma-2"
    color="white"
    data-aos="fade-up-right"
    :data-aos-delay="200"
    elevation="0"
    @mouseover="isHovering = true"
    @mouseleave="isHovering = false"
    :to="'/news/' + item.id"
  >
    <v-row>
      <v-col
        cols="12"
        sm="3"
        md="3"
        class="d-flex justify-center"
        v-if="item.avatarImage"
      >
        <v-avatar size="80">
          <v-img
            :src="getImageUrl(item.avatarImage[0])"
            :alt="item.title"
            width="80"
            fit
          ></v-img>
        </v-avatar>
      </v-col>
      <v-col cols="12" sm="9" md="9" class="text-start">
        <div class="text-body-1">{{ truncatedTitle(item.title) }}</div>
        <div
          class="my-2"
          :class="isHovering ? 'text-secondary' : 'text-primary'"
        >
          Read More
        </div>

        <div
          class="horizontalLineSecondary"
          v-if="isHovering"
          style="--line-width: 15%"
        ></div>
        <div class="horizontalLine" v-else style="--line-width: 15%"></div>
      </v-col>
    </v-row>
  </v-card>
</template>

<script setup>
// props item
const { item } = defineProps({
  item: Object,
  index: Number,
});

let isHovering = ref(false);
const truncatedTitle = (title) => {
  // truncate title if it is too long
  const maxWords = 80;
  const words = title.split(" ");
  if (words.length > maxWords) {
    return words.slice(0, maxWords).join(" ") + "...";
  }
  return title;
};

const getImageUrl = (url) => {
  const runtimeConfig = useRuntimeConfig();
  return runtimeConfig.public.ASSET_DOMAIN + url;
};
</script>
