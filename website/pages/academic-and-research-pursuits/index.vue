<template>
  <div>
    <section-title title="KSRI PROJECTS & STUDIES" />

    <!-- add button list -->
    <div
      class="d-flex justify-center align-center mx-2"
      :class="$device.isMobile ? 'flex-wrap' : 'flex-row'"
    >
      <div class="text-h6">Series:</div>
      <!-- {{ projectSeries }} -->
      <div v-for="series in projectSeries" :key="series">
        <v-btn
          color="primary"
          :variant="activeSeries === series ? 'flat' : 'outlined'"
          rounded="pill"
          class="ma-2"
          @click="activeSeries = series"
        >
          {{ series }}
        </v-btn>
      </div>
    </div>
    <div
      class="d-flex justify-center align-center mx-2"
      :class="$device.isMobile ? 'flex-wrap' : 'flex-row'"
    >
      <div class="text-h6">Status:</div>
      <div v-for="category in projectStatus" :key="category">
        <v-btn
          color="primary"
          :variant="activeStatus === category ? 'flat' : 'outlined'"
          rounded="pill"
          class="ma-2"
          @click="activeStatus = category"
        >
          {{ category }}
        </v-btn>
      </div>
    </div>
    <div class="my-8 mx-6">
      <!-- display projects -->
      <div>
        <displayProjects :getEventsByCategory="getEventsByCategory" />
      </div>

      <!-- if getEventsByCategory is empty, then display message -->
      <div v-if="getEventsByCategory.length === 0">
        <div class="text-h6 text-center">No projects found</div>
      </div>

      <!-- display Ancient Indian Knowledge Series  -->
      <div v-if="activeStatus === 'Ancient Indian Knowledge Series'">
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

let activeStatus = ref("All");

const projectStatus = [
  "All",
  "Completed",
  "On-Going",
  // "Ancient Indian Knowledge Series",
  "Future Projects",
];

let activeSeries = ref("All");
let projectSeries = ref(["All"]);
const seriesData = await queryContent("projects", "series").findOne();

projectSeries.value = ["All", ...seriesData.body];

let projects = [
  ...completedprojects.body,
  ...ongoingprojects.body,
  ...futureprojects.body,
];

const getEventsByCategory = computed(() => {
  //  return based on  activeStatus filter and activeSeries filter
  //  for activeSeries => filter based on key with name projectSeries in project object amd if activeSeries is All, then ignore current filter
  //  for activeStatus => filter based on key with name status in project object and if activeStatus  is All, then ignore current filter
  //  apply both filter and return

  if (activeStatus.value === "All" && activeSeries.value === "All") {
    return projects;
  } else if (activeStatus.value === "All" && activeSeries.value !== "All") {
    return projects.filter((project) => {
      return project.projectSeries === activeSeries.value;
    });
  } else if (activeStatus.value !== "All" && activeSeries.value === "All") {
    return projects.filter((project) => {
      return project.status === activeStatus.value;
    });
  } else {
    return projects.filter((project) => {
      return (
        project.status === activeStatus.value &&
        project.projectSeries === activeSeries.value
      );
    });
  }
});
</script>
