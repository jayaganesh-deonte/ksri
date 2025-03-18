<template>
  <generic-crud
    entityName="Endowments"
    :apiEndpoint="apiEndpoint"
    :entityFields="endowmentFields"
    :headers="endowmentHeaders"
    :addIdToPayload="true"
  />
</template>

<script setup>
const apiEndpoint = "/contribute/endownments";

const endowmentFields = [
  {
    key: "title",
    label: "Title",
    type: "text",
    rules: [(v) => !!v || "Title is required"],
  },
  {
    key: "initiatedBy",
    label: "Initiated By",
    type: "text",
    rules: [(v) => !!v || "Initiated By is required"],
  },
  {
    key: "topic",
    label: "Topic",
    type: "textarea",
    rules: [(v) => !!v || "Topic is required"],
  },
  {
    key: "itemPublishStatus",
    label: "Publish Status",
    type: "auto-complete",
    rules: [(v) => !!v || "Publish Status is required"],
    items: ["PUBLISHED", "DRAFT"],
  },
];

const endowmentHeaders = [
  { title: "Title", key: "title" },
  { title: "Initiated By", key: "initiatedBy" },
  { title: "Topic", key: "topic" },
  { title: "Actions", key: "actions", sortable: false },
];
</script>
