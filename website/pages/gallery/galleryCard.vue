<template>
  <v-card
    class="ma-4"
    rounded="0"
    elevation="0"
    width="300"
    @mouseover="handleMouseOver"
    @mouseleave="handleMouseLeave"
  >
    <v-img :src="image.imageUrl" fit />
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
</script>

<style scoped></style>
