<template>
  <div class="my-4">
    <div
      class="heading-with-line text-h4 mb-4 font-weight-bold text-primary text-center"
      data-aos="fade-up"
      data-aos-delay="600"
    >
      {{ title }}
    </div>

    <v-row justify="center">
      <v-col
        v-for="(item, index) in editedInfo"
        :key="index"
        cols="12"
        sm="6"
        md="4"
      >
        <v-card
          elevation="0"
          rounded="0"
          color="greenBg"
          height="300"
          class="d-flex flex-column justify-center align-center pa-2"
          data-aos="fade-up-left"
          :data-aos-delay="index * 200 + 600"
        >
          <div class="text-h6 text-center mb-4">
            {{ item }}
          </div>
          <v-divider thickness="3" width="100" color="primary"></v-divider>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  props: ["title", "editedInfo"],
};
</script>

<style></style>
