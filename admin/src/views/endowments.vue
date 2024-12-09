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
const apiEndpoint = import.meta.env.VITE_API_URL + "/contribute/endownments";

const endowmentFields = [
  {
    key: "title",
    label: "Title",
    type: "text",
    rules: [(v) => !!v || "Title is required"],
    editDisabled: true,
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
    type: "text-area",
    rules: [(v) => !!v || "Topic is required"],
  },
];

const endowmentHeaders = [
  { title: "Title", key: "title" },
  { title: "Initiated By", key: "initiatedBy" },
  { title: "Topic", key: "topic" },
  { title: "Actions", key: "actions", sortable: false },
];
</script>
