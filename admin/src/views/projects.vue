<template>
  <generic-crud
    entityName="Project"
    :apiEndpoint="apiEndpoint"
    :entityFields="projectFields"
    :headers="projectHeaders"
    :addIdToPayload="true"
  />
</template>

<script setup>
const apiEndpoint = import.meta.env.VITE_API_URL + "/projects";

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
  {
    key: "sponsor",
    label: "Sponsor",
    type: "text",
  },
  {
    key: "status",
    label: "Status",
    type: "auto-complete",
    rules: [(v) => !!v || "Status is required"],
    items: ["On-Going", "Completed"],
    editDisabled: false,
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
  { key: "status", title: "Status" },
  { key: "actions", title: "Actions" },
];
</script>
