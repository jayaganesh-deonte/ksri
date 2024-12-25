<template>
  <div>
    <section-title title="KSRI PROJECTS & STUDIES" />

    <!-- add button list -->
    <div
      class="d-flex justify-center mx-2"
      :class="$device.isMobile ? 'flex-wrap' : 'flex-row'"
    >
      <div v-for="category in projectButtonList" :key="category">
        <v-btn
          color="primary"
          :variant="activeCategory === category ? 'flat' : 'outlined'"
          rounded="pill"
          class="ma-2"
          @click="activeCategory = category"
        >
          {{ category }}
        </v-btn>
      </div>
    </div>
    <div class="my-8 mx-6">
      <!-- display completed projects -->
      <div v-if="activeCategory === 'Completed'">
        <displayProjects :getEventsByCategory="getEventsByCategory" />
      </div>

      <!-- display ongoing projects -->
      <div v-if="activeCategory === 'On-Going'">
        <displayProjects :getEventsByCategory="getEventsByCategory" />
      </div>

      <!-- display future projects -->
      <div v-if="activeCategory === 'Future Projects'">
        <displayProjects :getEventsByCategory="getEventsByCategory" />
        <!-- <div
          v-for="(project, index) in getEventsByCategory"
          :key="project"
          data-aos="fade-up"
          :data-aos-delay="index * 100 + 500"
        >
          <v-card class="pa-4 ma-2" height="100%" rounded="0">
            <div
              class="text-center d-flex flex-column justify-center align-center"
            >
              <div class="text-h5 font-weight-bold">{{ project.title }}</div>
              <div class="horizontalLine my-6" style="--line-width: 10%"></div>
              <div class="text-subtitle-1">{{ project.subTitle }}</div>
            </div>
          </v-card>
        </div> -->
      </div>

      <!-- display Ancient Indian Knowledge Series  -->
      <div v-if="activeCategory === 'Ancient Indian Knowledge Series'">
        <div
          v-for="(projects, category, index) in getEventsByCategory"
          :key="projects"
          data-aos="fade-up"
          :data-aos-delay="index * 100 + 500"
        >
          <v-card class="pa-4 ma-2" height="100%" rounded="0">
            <div
              class="text-secondary"
              data-aos="fade-right"
              :data-aos-delay="index * 100 + 500"
            >
              <v-icon>mdi-square-medium</v-icon>
              Ancient Indian Knowledge Series
            </div>
            <div
              class="text-h6 font-weight-bold"
              data-aos="fade-right"
              :data-aos-delay="index * 100 + 500"
            >
              {{ category }}
            </div>
            <div class="horizontalLine my-2" style="--line-width: 5%"></div>

            <!-- display projects with v-row v-col -->
            <v-row class="ma-2 pa-2">
              <v-col
                v-for="project in projects"
                :key="project"
                cols="12"
                sm="4"
                style="border: 1px solid #f0f5f0"
                data-aos="fade-up"
                :data-aos-delay="100"
              >
                <div class="text-body-1">
                  {{ project }}
                </div>
              </v-col>
            </v-row>
          </v-card>
        </div>
        <div class="d-flex align-center ma-2">
          <v-icon class="mr-2">mdi-information</v-icon>
          Those marked with *symbols have already been sponsored and these
          monographs would be published shortly.
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
useSeoMeta({
  title: "Academic and Research Pursuits",
  description: "Academic and Research Pursuits of KSRI",
  ogTitle: "Academic and Research Pursuits",
  ogDescription: "Academic and Research Pursuits of KSRI",
  twitterTitle: "Academic and Research Pursuits",
  twitterDescription: "Academic and Research Pursuits of KSRI",
});
import displayProjects from "./components/displayProjects.vue";

// const projects = await queryContent("projects").findOne();

// console.log("projects", projects);

const completedprojects = await queryContent(
  "projects",
  "completedprojects"
).findOne();

const ongoingprojects = await queryContent(
  "projects",
  "ongoingprojects"
).findOne();

const futureprojects = await queryContent(
  "projects",
  "futureprojects"
).findOne();

const ancientIndianKnowledgeSeries = await queryContent(
  "projects",
  "ancientindianknowledgeseries"
).findOne();

let activeCategory = ref("Completed");

const projectButtonList = [
  "Completed",
  "On-Going",
  // "Ancient Indian Knowledge Series",
  "Future Projects",
];

const getEventsByCategory = computed(() => {
  if (activeCategory.value === "Completed") {
    return completedprojects.body;
  } else if (activeCategory.value === "On-Going") {
    return ongoingprojects.body;
  } else if (activeCategory.value === "Future Projects") {
    return futureprojects.body;
  } else if (activeCategory.value === "Ancient Indian Knowledge Series") {
    return ancientIndianKnowledgeSeries.body[0];
  }
});
</script>
