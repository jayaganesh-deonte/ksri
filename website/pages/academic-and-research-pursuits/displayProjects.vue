<template>
  <v-row>
    <v-col
      v-for="project in getEventsByCategory"
      :key="project"
      cols="12"
      sm="4"
      data-aos="fade-up"
    >
      <v-card class="pa-4 borderLeft" height="100%" rounded="0">
        <v-row>
          <v-col cols="12" :sm="project.completedYear ? '9' : '12'">
            <div class="text-body-1 font-weight-bold" data-aos="fade-right">
              {{ project.title }}
            </div>
            <div class="horizontalLine my-4" style="--line-width: 20%"></div>
            <div class="text-body-1" data-aos="fade-right">
              {{ project.subTitle }}
            </div>
          </v-col>
          <v-col cols="12" sm="3" v-if="project.completedYear">
            <v-card
              color="secondary"
              class="text-center pa-2"
              data-aos="fade-left"
            >
              {{ project.completedYear }}
            </v-card>
          </v-col>
        </v-row>
      </v-card>
    </v-col>
  </v-row>
</template>

<!-- <script setup lang="ts">
defineProps<{
  getEventsByCategory: any;
}>();
</script> -->

<script setup>
const props = defineProps({
  getEventsByCategory: Array,
});
</script>

<style scoped>
.borderLeft {
  border-left: 4px solid #abbe88;
  transition: border-left 0.3s ease;
}

.borderLeft:hover {
  border-left: 8px solid #abbe88;
}
</style>
