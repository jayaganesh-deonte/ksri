<template>
  <div>
    <section-title class="my-8" title="KSRI PROJECTS & STUDIES" />

    <!-- add button list -->
    <!-- <div
      class="d-flex flex-wrap justify-center align-center mx-2"
      :class="$device.isMobile ? 'flex-wrap' : 'flex-row'"
    >
      <div class="text-h6">Series:</div>
      <div v-for="series in projectSeries" :key="series">
        <v-menu v-if="subSeriesMapping[series]" offset-y>
          <template v-slot:activator="{ props }">
            <div
              v-bind="props"
              class="d-flex flex-column ma-2"
              style="background-color: #fafbfa"
            >
              <v-btn
                color="primary"
                :variant="activeSeries === series ? 'flat' : 'outlined'"
                rounded="pill"
                class="ma-2"
                size="large"
                style="text-transform: none"
                height="100%"
              >
                <div class="ma-4">
                  <div>{{ series }}</div>

                  <div
                    v-if="getSeriesDescriptionFromSubSeries(series)"
                    style="font-size: 0.7em"
                    class="font-weight-light text-center mt-2"
                    v-html="getSeriesDescriptionFromSubSeries(series)"
                  />
                </div>
              </v-btn>
            </div>
          </template>
          <v-list>
            <v-list-item
              v-for="sub in subSeriesMapping[series]"
              :key="sub"
              @click="
                activeSubSeries = sub;
                activeSeries = series;
              "
              :style="
                activeSubSeries === sub ? 'background-color: #F0F5F0' : ''
              "
            >
              <v-list-item-title>{{ sub }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
        <v-btn
          color="primary"
          :variant="activeSeries === series ? 'flat' : 'outlined'"
          rounded="pill"
          class="ma-2"
          @click="
            activeSeries = series;
            activeSubSeries = 'All';
          "
          v-else
        >
          {{ series }}
        </v-btn>
      </div>
    </div> -->
    <!-- <div
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
    </div> -->

    <!-- search box for project -->
    <div class="mx-6">
      <v-row>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="searchProjects"
            prepend-inner-icon="mdi-magnify"
            label="Search project"
            variant="outlined"
            rounded="pill"
            density="compact"
            hide-details
            class="ma-2"
            bg-color="white"
          ></v-text-field>
        </v-col>
        <!-- add two more col and then button in it to filter by status & filter by series -->
        <v-col cols="12" md="2">
          <v-menu offset-y>
            <template v-slot:activator="{ props }">
              <v-select
                v-bind="props"
                v-model="activeStatus"
                :items="[]"
                label="Filter by Status"
                variant="outlined"
                rounded="pill"
                density="compact"
                hide-details
                class="ma-2"
                bg-color="white"
              ></v-select>
            </template>
            <v-list>
              <v-list-item
                v-for="status in projectStatus"
                :key="status"
                @click="activeStatus = status"
                :style="
                  activeStatus === status ? 'background-color: #F0F5F0' : ''
                "
              >
                <v-list-item-title>{{ status }}</v-list-item-title>
                <!-- <v-divider></v-divider> -->
              </v-list-item>
            </v-list>
          </v-menu>
        </v-col>
        <v-col cols="12" md="4">
          <!-- using menu & sub menu display series & sub series -->
          <v-menu offset-y>
            <template v-slot:activator="{ props }">
              <v-select
                v-bind="props"
                v-model="activeSeries"
                :items="['All']"
                label="Filter by Series"
                variant="outlined"
                rounded="pill"
                density="compact"
                hide-details
                class="ma-2"
                bg-color="white"
              ></v-select>
            </template>
            <v-list>
              <!-- item to display only All -->
              <v-list-item
                @click="
                  activeSeries = 'All';
                  activeSubSeries = 'All';
                "
              >
                <v-list-item-title>All</v-list-item-title>
              </v-list-item>
              <!-- <v-divider></v-divider> -->
              <!-- sub series -->
              <template v-for="series in projectSeries" :key="series">
                <v-list-group
                  v-model="subSeriesMapping[series]"
                  v-if="series != 'All'"
                >
                  <template v-slot:activator="{ props }">
                    <v-list-item v-bind="props">
                      <!-- :title="series"
                      :subtitle="getSeriesDescriptionFromSubSeries(series)" -->
                      <v-list-item-title>{{ series }}</v-list-item-title>
                      <div class="text-caption font-weight-light">
                        {{ getSeriesDescriptionFromSubSeries(series) }}
                      </div>
                    </v-list-item>
                  </template>
                  <v-list-item
                    v-for="sub in subSeriesMapping[series]"
                    :key="sub"
                    @click="
                      activeSubSeries = sub;
                      activeSeries = series;
                    "
                  >
                    <v-list-item-title>{{ sub }}</v-list-item-title>
                  </v-list-item>
                </v-list-group>
              </template>
            </v-list>
          </v-menu>
        </v-col>
      </v-row>
    </div>

    <div class="my-8 mx-6">
      <!-- display projects -->
      <div>
        <displayProjects :getEventsByCategory="getEventsByCategory" />
      </div>

      <!-- if getEventsByCategory is empty, then display message -->
      <div v-if="getEventsByCategory.length === 0">
        <div class="text-h6 text-center">
          No projects found for selected filter
        </div>
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

const slideshowData = await queryContent("slideshow").findOne();

let activeStatus = ref("All");

const projectStatus = [
  "All",
  "Completed",
  "On-Going",
  // "Ancient Indian Knowledge Series",
  "Future Projects",
];

let activeSeries = ref("All");
let activeSubSeries = ref("All");
let projectSeries = ref(["All"]);
const seriesData = await queryContent("projects", "series").findOne();

projectSeries.value = ["All", ...seriesData.body];

const subSeriesData = await queryContent("projects", "subseries").findOne();

const subSeries = subSeriesData.body;

// subSeries = [
//   {
//     "name": "Ancient Indian Knowledge Series",
//     "subSeries": [
//       "Science",
//       "Art and Architecture",
//       "Social Studies",
//       "Literature"
//     ]
//   }
// ]

let subSeriesMapping = {};

for (const element of subSeries) {
  subSeriesMapping[element.name] = ["All"];
  subSeriesMapping[element.name] = [
    ...subSeriesMapping[element.name],
    ...element.subSeries,
  ];
}

// subSeriesMapping = {"Ancient Indian Knowledge Series":["Science","Art and Architecture","Social Studies","Literature"]}

let projects = [
  ...completedprojects.body,
  ...ongoingprojects.body,
  ...futureprojects.body,
];

const getSeriesDescriptionFromSubSeries = (nameOfSeries) => {
  for (const element of subSeries) {
    if (element.name === nameOfSeries) {
      // return element.description;
      // for /n new line in description with br tag
      // return element.description.replace(/\n/g, "<br />");
      // if description is empty, then return empty string
      console.log("element.description", element.description.length);
      if (element.description.length == 1) {
        return "";
      } else {
        // return "(" + element.description.replace(/\n/g, "<br />") + ")";
        return element.description;
      }
    }
  }
};

let searchProjects = ref("");

const getEventsByCategory = computed(() => {
  //  return based on activeStatus filter, activeSeries filter, activeSubSeries filter and search filter
  //  for activeSeries => filter based on key with name projectSeries in project object and if activeSeries is All, then ignore current filter
  //  for activeStatus => filter based on key with name status in project object and if activeStatus is All, then ignore current filter
  //  for activeSubSeries => filter based on key with name subSeries in project object and if activeSubSeries is All, then ignore current filter
  //  for search => filter based on project title containing search text (case insensitive)
  //  apply all filters and return

  let filteredProjects = projects.filter((project) => {
    const seriesMatch =
      activeSeries.value === "All" ||
      project.projectSeries === activeSeries.value;
    const statusMatch =
      activeStatus.value === "All" || project.status === activeStatus.value;
    const subSeriesMatch =
      activeSubSeries.value === "All" ||
      project.projectSubSeries === activeSubSeries.value;

    return seriesMatch && statusMatch && subSeriesMatch;
  });
  console.log("filteredProjects", filteredProjects);

  let matchedProjects = [];

  if (searchProjects.value !== "") {
    filteredProjects.forEach((project) => {
      let matched = false;
      for (const key in project) {
        if (typeof project[key] === "string") {
          if (
            project[key]
              .toLowerCase()
              .includes(searchProjects.value.toLowerCase())
          ) {
            matched = true;
            break;
          }
        }
      }
      if (matched) {
        matchedProjects.push(project);
      }
    });
    filteredProjects = matchedProjects;
  } // if search is not empty, then filter based on project all keys

  // sort the filterProjects to show publicationStatus as Upcoming first and then other status
  filteredProjects.sort((a, b) => {
    if (a.publicationStatus === "Upcoming") {
      return -1;
    }
    if (b.publicationStatus === "Upcoming") {
      return 1;
    }
    return 0;
  });
  return filteredProjects;
});
</script>
