<template>
  <generic-crud
    entityName="Milestone"
    :apiEndpoint="apiEndpoint"
    :entityFields="milestoneFields"
    :headers="milestoneHeaders"
    :addIdToPayload="true"
    :sortBy="[{ key: 'year', order: 'desc' }]"
  />
</template>

<script setup>
const apiEndpoint = "/milestones";

const milestoneFields = [
  {
    key: "year",
    label: "Year",
    type: "text",
    rules: [(v) => !!v || "Year is required"],
  },
  {
    key: "title",
    label: "Title",
    type: "text",
    rules: [(v) => !!v || "Title is required"],
  },
  {
    key: "itemPublishStatus",
    label: "Publish Status",
    type: "auto-complete",
    rules: [(v) => !!v || "Publish Status is required"],
    items: ["PUBLISHED", "DRAFT"],
  },

  {
    key: "subTitle",
    label: "Sub Title",
    type: "text",
    rules: [(v) => !!v || "subTitle is required"],
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
  { title: "Sub Title", key: "subTitle" },
  // {
  //   title: "Description",
  //   key: "description",
  //   // render html

  // },
  { title: "Actions", key: "actions", sortable: false },
];
</script>
