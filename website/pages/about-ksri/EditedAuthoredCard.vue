<template>
  <div class="my-4">
    <div
      class="heading-with-line text-h4 mb-4 font-weight-bold text-primary text-center"
      data-aos="fade-up"
      data-aos-delay="600"
    >
      {{ title }}
    </div>

    <!-- <v-row justify="center">
      <v-col
        v-for="(item, index) in editedInfo"
        :key="index"
        cols="12"
        sm="6"
        md="3"
      >
        <v-card
          elevation="0"
          rounded="0"
          color="secondary"
          height="300"
          class="d-flex flex-column justify-center align-center pa-2"
          data-aos="fade-up-left"
          :data-aos-delay="index * 200 + 600"
        >
          <div class="text-h6 text-left mb-4">
            {{ item }}
          </div>
          <v-divider thickness="3" width="70%" color="white"></v-divider>
        </v-card>
      </v-col>
    </v-row> -->
    <div class="d-flex flex-column justify-start align-center">
      <v-card
        v-for="(item, index) in editedInfo"
        :key="index"
        class="d-flex justify-start align-center pa-2 text-start text-h6 ma-2"
        elevation="0"
        :color="cardColor"
        min-height="100"
        data-aos="fade-up"
        :width="$device.isMobile ? '' : '40vw'"
      >
        <div
          class="d-flex"
          :class="`${$device.isMobile ? ' flex-column ' : 'flex-row'}`"
        >
          <div
            class="d-flex flex-column justify-space-between mx-2"
            data-aos="fade-left"
          >
            <div>{{ item }}</div>
            <v-divider thickness="3" width="100" color="primary"></v-divider>
          </div>
        </div>
      </v-card>
    </div>
  </div>
</template>

<script>
export default {
  props: ["title", "editedInfo", "cardColor"],
};
</script>

<style></style>
