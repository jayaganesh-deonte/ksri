<template>
  <v-card class="my-4" data-aos="fade-up">
    <v-card elevation="0" rounded="0" color="greenBg">
      <v-row class="ma-2 text-h5" data-aos="fade-right">
        <v-col cols="1"> <v-icon> mdi-web </v-icon> </v-col>
        <v-col cols="11" class="font-weight-bold">
          Under the Supervision of
          <span class="text-secondary">
            {{ supervisorName }}
          </span>
        </v-col>
      </v-row>
    </v-card>
    <!-- display mphil  scholars -->
    <div v-for="mphilStudent in scholars" :key="mphilStudent">
      <v-row class="ma-2" data-aos="fade-right">
        <v-col>
          <div class="text-body-1 text-start">
            {{ mphilStudent.name }}
          </div>
        </v-col>
        <v-col>
          <div class="text-body-1 text-start d-flex align-center">
            <v-icon>mdi-bookmark</v-icon>
            {{ mphilStudent.areaOfStudy }}
          </div>
        </v-col>
        <v-col>
          <div
            class="text-body-1 text-start d-flex align-center"
            v-if="mphilStudent.completedYear"
          >
            {{ mphilStudent.completedYear }}
          </div>
          <div class="text-body-1 text-start d-flex align-center" v-else>
            {{ mphilStudent.startedYear }}
          </div>
        </v-col>
      </v-row>
      <v-divider />
    </div>
  </v-card>
</template>

<script setup>
const props = defineProps({
  scholars: {
    type: Array,
    required: true,
  },
  supervisorName: {
    type: String,
    required: true,
  },
});
</script>
