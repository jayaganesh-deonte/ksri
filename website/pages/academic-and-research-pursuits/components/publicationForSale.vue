<template>
  <v-card
    class="ma-4 pa-6 d-flex flex-column justify-space-between align-center"
    rounded="0"
    data-aos="fade-up"
  >
    <div class="text-h5" data-aos="fade-right">{{ title }}</div>
    <div class="horizontalLine my-3" style="--line-width: 10%"></div>
    <div data-aos="fade-left">
      <v-row>
        <!-- for publicationsForSale -->
        <v-col
          v-for="publicationForSale in publicationsForSale"
          :key="publicationForSale"
          cols="12"
          md="6"
        >
          <v-list-item data-aos="fade-up">
            <!-- prepend book icon  -->
            <template v-slot:prepend>
              <v-icon>mdi-book-open-blank-variant-outline</v-icon>
            </template>

            <div class="">
              {{ publicationForSale }}
            </div>
          </v-list-item>
          <div class="horizontalLine" style="--line-height: 1px"></div>
        </v-col>
      </v-row>
    </div>
  </v-card>
</template>

<script setup>
const props = defineProps({
  publicationsForSale: {
    type: Array,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
});
</script>
