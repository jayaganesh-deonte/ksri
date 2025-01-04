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
            <div class="text-body-1 font-weight-bold" data-aos="fade-right">
              {{ project.title }}
            </div>
            <div class="horizontalLine my-4" style="--line-width: 20%"></div>
            <div class="text-body-1" data-aos="fade-right">
              {{ project.subTitle }}
            </div>
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
              color="accentGreen"
              class="text-center text-white pa-2 mt-2 text-body-1"
              data-aos="fade-left"
              v-if="project.publicationStatus"
            >
              {{ project.publicationStatus }}
            </v-card>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <v-simple-table>
              <template v-slot:default>
                <tbody>
                  <tr v-if="project.sponsor">
                    <td class="text-body-1 font-weight-bold">Sponsored by</td>
                    <td>
                      <v-chip color="secondary" class="ma-2" label>
                        {{ project.sponsor }}
                      </v-chip>
                    </td>
                  </tr>

                  <tr v-if="project.projectInvestigator">
                    <td class="text-body-1 font-weight-bold">
                      Project Investigator
                    </td>
                    <td>
                      <v-chip color="secondary" class="ma-2" label>
                        {{ project.projectInvestigator }}
                      </v-chip>
                    </td>
                  </tr>
                  <tr v-if="project.coProjectInvestigators">
                    <td class="text-body-1 font-weight-bold">
                      Co-Project Investigators
                    </td>
                    <td>
                      <v-chip color="secondary" class="ma-2" label>
                        {{ project.coProjectInvestigators }}
                      </v-chip>
                    </td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
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
