<template>
  <div>
    <generic-crud
      v-if="!isLoading"
      entityName="Student"
      :apiEndpoint="apiEndpoint"
      :entityFields="studentFields"
      :headers="headers"
      :addIdToPayload="true"
    />
    <v-progress-circular
      v-if="isLoading"
      indeterminate
      color="primary"
    ></v-progress-circular>
  </div>
</template>

<script setup>
import axiosInstance from "@/axios";
import { ref } from "vue";

const apiEndpoint = "/students";

let isLoading = ref(true);
let supervisors = [];

const getSupervisors = async () => {
  isLoading.value = true;

  const apiEndpoint = "/supervisor";

  const response = await axiosInstance.get(apiEndpoint);

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

const studentFields = [
  {
    key: "name",
    label: "Name",
    type: "text",
    rules: [(v) => !!v || "Name is required"],
  },
  {
    key: "itemPublishStatus",
    label: "Publish Status",
    type: "auto-complete",
    rules: [(v) => !!v || "Publish Status is required"],
    items: ["PUBLISHED", "DRAFT"],
  },
  {
    key: "course",
    label: "Course",
    type: "auto-complete",
    items: ["Ph.D.", "M.Phil."],
    rules: [(v) => !!v || "Course is required"],
  },
  {
    key: "areaOfStudy",
    label: "Area of Study",
    type: "text",
    rules: [(v) => !!v || "Area of Study is required"],
  },
  {
    key: "supervisor",
    label: "Supervisor",
    type: "auto-complete",
    items: supervisors,
    rules: [(v) => !!v || "Supervisor is required"],
  },
  {
    key: "status",
    label: "Status",
    type: "auto-complete",
    items: ["On-Going", "Completed"],
    rules: [(v) => !!v || "Status is required"],
  },
  // startedYear
  {
    key: "startedYear",
    label: "Started Year",
    type: "text",
    rules: [(v) => !!v || "Started Year is required"],
  },
  {
    key: "completedYear",
    label: "Completed Year",
    type: "text",
  },
];

const headers = [
  { title: "Name", key: "name" },
  { title: "Course", key: "course" },
  { title: "Area of Study", key: "areaOfStudy" },
  { title: "Supervisor", key: "supervisor" },
  { title: "Status", key: "status" },
  { title: "Started Year", key: "startedYear" },
  { title: "Completed Year", key: "completedYear" },
  { title: "Actions", key: "actions", sortable: false },
];
</script>
