<template>
  <generic-crud
    entityName="Dainandini"
    :apiEndpoint="apiEndpoint"
    :entityFields="dainandiniFields"
    :headers="dainandiniHeaders"
    :addIdToPayload="true"
  />
</template>

<script setup>
const apiEndpoint = "/dainandini";

const dainandiniFields = [
  {
    key: "audioFile",
    label: "Audio File",
    type: "document",
    rules: [(v) => !!v || "Audio File  is required"],
  },
  {
    key: "sanskritLine1",
    label: "Sanskrit Line 1",
    type: "text",
    rules: [(v) => !!v || "Sanskrit Line 1 is required"],
  },
  {
    key: "sanskritLine2",
    label: "Sanskrit Line 2",
    type: "text",
    rules: [(v) => !!v || "Sanskrit Line 2 is required"],
  },
  {
    key: "description",
    label: "Description",
    type: "textarea",
    rules: [(v) => !!v || "Description is required"],
  },
  {
    key: "itemPublishStatus",
    label: "Publish Status",
    type: "auto-complete",
    rules: [(v) => !!v || "Publish Status is required"],
    items: ["PUBLISHED", "DRAFT"],
  },
];

const dainandiniHeaders = [
  {
    key: "sanskritLine1",
    title: "Sanskrit Line 1",
  },
  {
    key: "sanskritLine2",
    title: "Sanskrit Line 2",
  },
  {
    key: "description",
    title: "Description",
  },
  {
    key: "actions",
    title: "Actions",
  },
];
</script>
