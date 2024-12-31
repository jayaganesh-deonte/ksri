<template>
  <div>
    <div class="text-center" v-if="isLoading">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
    </div>

    <generic-crud
      v-else
      entityName="Project"
      :apiEndpoint="apiEndpoint"
      :entityFields="projectFields"
      :headers="projectHeaders"
      :addIdToPayload="true"
    />
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import { getUserIdToken } from "@/services/auth";
import axios from "axios";

const apiEndpoint = import.meta.env.VITE_API_URL + "/projects";

let projectSeriesMappings = reactive({});

let allSubSeries = reactive([]);

const getProjectSeries = async () => {
  const apiEndpoint = import.meta.env.VITE_API_URL + "/project/series";
  const idToken = await getUserIdToken();

  const response = await axios.get(apiEndpoint, {
    headers: {
      Authorization: `${idToken}`,
    },
  });

  if (response.status === 200) {
    // add name to projectSeriesMappingsData
    let projectSeriesMappingsData = {};
    for (const item of response.data) {
      console.log("item", item);
      projectSeriesMappingsData[item.name] = item.subSeries.map(
        (subItem) => subItem.name
      );
    }
    console.log("projectSeriesMappingsData", projectSeriesMappingsData);
    Object.assign(projectSeriesMappings, projectSeriesMappingsData);
    // get all allSubSeries
    let allSubSeriesData = response.data.flatMap((item) =>
      item.subSeries.map((subItem) => subItem.name)
    );
    Object.assign(allSubSeries, allSubSeriesData);

    // get names only
    const projectSeriesWithName = response.data.map(
      (projectSeries) => projectSeries.name
    );
    return projectSeriesWithName;
  }
};

let isLoading = ref(true);

const projectSeries = await getProjectSeries();

let supervisors = [];

const getSupervisors = async () => {
  isLoading.value = true;

  const idToken = await getUserIdToken();
  const apiEndpoint = import.meta.env.VITE_API_URL + "/supervisor";

  const response = await axios.get(apiEndpoint, {
    headers: {
      Authorization: `${idToken}`,
    },
  });

  if (response.status === 200) {
    // get names only
    const supervisorsWithName = response.data.map(
      (supervisor) => supervisor.name
    );
    Object.assign(supervisors, supervisorsWithName);
    isLoading.value = false;
  }
};

await getSupervisors();

// {
//     "title": "PadukaSahasram( English and Tamil Trans.)",
//     "subTitle": "- Sri KesavaIyengar Endowment",
//     "completedYear": "2011-13",
//     "status": "On-Going"
// }
const projectFields = [
  {
    key: "title",
    label: "Title",
    type: "text",
    rules: [(v) => !!v || "Title is required"],
    editDisabled: true,
  },
  {
    key: "subTitle",
    label: "Sub Title",
    type: "text",
    rules: [(v) => !!v || "Sub Title is required"],
  },
  {
    key: "startYear",
    label: "Started Year",
    type: "text",
  },
  {
    key: "completedYear",
    label: "Completed Year",
    type: "text",
  },
  // publicationStatus: "Published" | "Inprint" | "Unpublished";
  // projectInvestigator: string;
  // coProjectInvestigators: string;
  {
    key: "projectInvestigator",
    label: "Project Investigator",
    type: "auto-complete",
    items: supervisors,
  },
  {
    key: "coProjectInvestigators",
    label: "Co-Project Investigators",
    type: "auto-complete",
    items: supervisors,
  },
  {
    key: "publicationStatus",
    label: "Publication Status",
    type: "auto-complete",
    items: ["Published", "Inprint", "Unpublished"],
  },
  {
    key: "sponsor",
    label: "Sponsor",
    type: "text",
  },
  {
    key: "keywords",
    label: "Keywords",
    type: "textarea",
  },
  {
    key: "status",
    label: "Status",
    type: "auto-complete",
    rules: [(v) => !!v || "Status is required"],
    items: ["On-Going", "Completed", "Future Projects"],
    editDisabled: false,
  },
  {
    key: "projectSeries",
    label: "Project Series",
    type: "auto-complete",
    items: projectSeries,
  },
  {
    key: "projectSubSeries",
    label: "Project Sub Series",
    type: "auto-complete",
    items: allSubSeries,
  },
];

const projectHeaders = [
  {
    key: "title",
    title: "Title",
  },
  {
    key: "subTitle",
    title: "Sub Title",
  },
  {
    key: "startYear",
    title: "Started Year",
  },
  {
    key: "completedYear",
    title: "Completed Year",
  },
  {
    key: "sponsor",
    title: "Sponsor",
  },
  {
    key: "projectSeries",
    title: "Project Series",
  },
  {
    key: "projectSubSeries",
    title: "Project Sub Series",
  },
  { key: "status", title: "Status" },
  { key: "actions", title: "Actions" },
];

isLoading.value = false;
</script>
