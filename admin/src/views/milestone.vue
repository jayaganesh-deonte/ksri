<template>
  <generic-crud
    entityName="Milestone"
    :apiEndpoint="apiEndpoint"
    :entityFields="milestoneFields"
    :headers="milestoneHeaders"
  />
</template>

<script setup>
const apiEndpoint = import.meta.env.VITE_API_URL + "/milestones";

const milestoneFields = [
  {
    key: "year",
    label: "Year",
    type: "text",
    rules: [(v) => !!v || "Year is required"],
    editDisabled: true,
  },
  {
    key: "title",
    label: "Title",
    type: "text",
    rules: [(v) => !!v || "Title is required"],
    editDisabled: true,
  },
  {
    key: "description",
    label: "Description",
    type: "editor",
    rules: [(v) => !!v || "Description is required"],
  },
];

const milestoneHeaders = [
  { title: "Year", key: "year" },
  { title: "Title", key: "title" },
  // {
  //   title: "Description",
  //   key: "description",
  //   // render html

  // },
  { title: "Actions", key: "actions", sortable: false },
];
</script>
