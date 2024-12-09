<template>
  <generic-crud
    entityName="Foreign Scholar"
    :apiEndpoint="apiEndpoint"
    :entityFields="scholarFields"
    :headers="scholarHeaders"
    :addIdToPayload="true"
  />
</template>

<script setup>
const apiEndpoint = import.meta.env.VITE_API_URL + "/foreign-scholars";

const scholarFields = [
  {
    key: "name",
    label: "Name",
    type: "text",
    rules: [(v) => !!v || "Name is required"],
    editDisabled: true,
  },
  {
    key: "university",
    label: "University",
    type: "text",
    rules: [(v) => !!v || "University is required"],
  },
  {
    key: "subject",
    label: "Subject",
    type: "text",
    rules: [(v) => !!v || "Subject is required"],
  },
];

const scholarHeaders = [
  {
    key: "name",
    title: "Name",
  },
  {
    key: "university",
    title: "University",
  },
  {
    key: "subject",
    title: "Subject",
  },
  {
    key: "actions",
    title: "Actions",
  },
];
</script>
