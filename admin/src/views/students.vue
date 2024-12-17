<template>
  <generic-crud
    entityName="Student"
    :apiEndpoint="apiEndpoint"
    :entityFields="studentFields"
    :headers="headers"
    :addIdToPayload="true"
  />
</template>

<script setup>
const apiEndpoint = import.meta.env.VITE_API_URL + "/students";

const studentFields = [
  {
    key: "name",
    label: "Name",
    type: "text",
    rules: [(v) => !!v || "Name is required"],
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
    type: "text",
    rules: [(v) => !!v || "Supervisor is required"],
  },
  {
    key: "status",
    label: "Status",
    type: "auto-complete",
    items: ["On-Going", "Completed"],
    rules: [(v) => !!v || "Status is required"],
  },
];

const headers = [
  { title: "Name", key: "name" },
  { title: "Course", key: "course" },
  { title: "Area of Study", key: "areaOfStudy" },
  { title: "Supervisor", key: "supervisor" },
  { title: "Status", key: "status" },
  { title: "Actions", key: "actions", sortable: false },
];
</script>
