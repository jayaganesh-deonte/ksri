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
          <v-col cols="12" :sm="display2ndColumn(project) ? 7 : 12">
            <div
              class="text-h6 font-weight-bold text-uppercase"
              data-aos="fade-right"
            >
              {{ project.title }}
            </div>
            <div class="horizontalLine my-4" style="--line-width: 20%"></div>
          </v-col>
          <v-col cols="12" sm="5" v-if="display2ndColumn(project)">
            <v-card
              color="secondary"
              class="text-center pa-2"
              data-aos="fade-left"
              v-if="project.completedYear"
            >
              {{ project.completedYear }}
            </v-card>
            <!-- display publicationStatus -->
            <v-card
              color="primary"
              class="text-center font-weight-bold text-white pa-2 mt-2 text-body-1"
              data-aos="fade-left"
              v-if="
                project.publicationStatus &&
                project.publicationStatus == 'Published'
              "
            >
              {{ project.publicationStatus }}
            </v-card>
            <!-- Upcoming -->
            <v-card
              color="#800000"
              class="text-center font-weight-bold pa-2 mt-2 text-body-1"
              data-aos="fade-left"
              v-if="
                project.publicationStatus &&
                project.publicationStatus == 'Upcoming'
              "
              style="color: #ffdf00"
            >
              {{ project.publicationStatus }}
            </v-card>
          </v-col>
        </v-row>
        <v-row>
          <div class="text-body-1 ma-4 text-justify" data-aos="fade-right">
            {{ project.subTitle }}
          </div>
        </v-row>
        <v-row>
          <v-col cols="12">
            <v-simple-table>
              <template v-slot:default>
                <tbody>
                  <tr v-if="project.sponsor">
                    <td class="text-body-1 font-weight-bold">Sponsored by</td>
                    <td style="max-width: 70%">
                      <v-card
                        elevation="0"
                        rounded="2"
                        color="secondary"
                        class="ma-2 pa-2 font-weight-bold"
                        variant="tonal"
                        style="word-break: break-word; white-space: normal"
                      >
                        {{ project.sponsor }}
                      </v-card>
                    </td>
                  </tr>

                  <tr v-if="project.projectInvestigator">
                    <td class="text-body-1 font-weight-bold">
                      Project Investigator
                    </td>
                    <td style="max-width: 70%">
                      <v-card
                        elevation="0"
                        rounded="2"
                        color="secondary"
                        class="ma-2 pa-2 font-weight-bold"
                        variant="tonal"
                        style="word-break: break-word; white-space: normal"
                      >
                        {{ projectInvestigator(project.projectInvestigator) }}
                      </v-card>
                    </td>
                  </tr>
                  <tr v-if="project.coProjectInvestigators">
                    <td class="text-body-1 font-weight-bold">
                      Co-Project Investigators
                    </td>
                    <td style="max-width: 70%">
                      <v-card
                        elevation="0"
                        rounded="2"
                        color="secondary"
                        class="ma-2 pa-2 font-weight-bold"
                        variant="tonal"
                        style="word-break: break-word; white-space: normal"
                      >
                        {{ project.coProjectInvestigators }}
                      </v-card>
                    </td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
          </v-col>
        </v-row>
        <v-row>
          <!-- description -->
          <v-col cols="12">
            <div
              class="text-body-1"
              data-aos="fade-right"
              v-html="project.description"
            ></div>
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

const display2ndColumn = (item) => {
  // return false;
  if (
    item.completedYear ||
    item.sponsor ||
    item.projectInvestigator ||
    item.coProjectInvestigators
  ) {
    return true;
  } else {
    return false;
  }
};

const projectInvestigator = (item) => {
  // if array then join with comma
  if (Array.isArray(item)) {
    return item.join(", ");
  } else {
    return item;
  }
};
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
