<template>
  <v-card
    class="pa-2 text-body-1 ma-2"
    color="white"
    data-aos="fade-up-right"
    :data-aos-delay="index * 100"
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
            :src="item.avatarImage"
            :alt="item.title"
            width="80"
            fit
          ></v-img>
        </v-avatar>
      </v-col>
      <v-col cols="12" sm="9" md="9" class="text-start">
        <div class="text-body-1">{{ item.title }}</div>
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
});

let isHovering = ref(false);
</script>
