<template>
  <v-card
    class="ma-4"
    rounded="0"
    elevation="0"
    width="300"
    @mouseover="handleMouseOver"
    @mouseleave="handleMouseLeave"
  >
    <v-img :src="getImageUrl(image.imageUrl[0])" fit>
      <template v-slot:placeholder>
        <div class="d-flex align-center justify-center fill-height">
          <v-progress-circular
            color="grey-lighten-4"
            indeterminate
          ></v-progress-circular>
        </div>
      </template>
    </v-img>
    <div class="text-body-1">
      {{ image.description }}
    </div>
    <div
      class="horizontal-line-animate"
      :class="{ show: isHovering, hide: !isHovering }"
    ></div>
  </v-card>
</template>

<script setup>
import { ref } from "vue";

defineProps({
  image: {
    type: Object,
    required: true,
  },
});

const isHovering = ref(false);

const handleMouseOver = () => {
  isHovering.value = true;
};

const handleMouseLeave = () => {
  isHovering.value = false;
};

const getImageUrl = (url) => {
  const runtimeConfig = useRuntimeConfig();
  return runtimeConfig.public.ASSET_DOMAIN + url;
};
</script>

<style scoped></style>
