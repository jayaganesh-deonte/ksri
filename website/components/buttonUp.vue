<template>
  <v-btn
    icon="mdi-arrow-up"
    color="secondary"
    size="small"
    @click="scrollUp"
    class="buttonUp"
  ></v-btn>
</template>

<script setup>
const scrollUp = () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};
</script>

<style scoped>
.buttonUp {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
}
</style>
