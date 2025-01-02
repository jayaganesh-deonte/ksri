<template>
  <generic-crud
    entityName="Traditional Scholar"
    :apiEndpoint="apiEndpoint"
    :entityFields="scholarFields"
    :headers="scholarHeaders"
    :addIdToPayload="true"
  />
</template>

<script setup>
const apiEndpoint = import.meta.env.VITE_API_URL + "/traditional-scholars";

const scholarFields = [
  {
    key: "name",
    label: "Name",
    type: "text",
    rules: [(v) => !!v || "Name is required"],
    // editDisabled: true,
  },
  {
    key: "itemPublishStatus",
    label: "Publish Status",
    type: "auto-complete",
    rules: [(v) => !!v || "Publish Status is required"],
    items: ["PUBLISHED", "DRAFT"],
  },
  {
    key: "description",
    label: "Description",
    type: "text",
    rules: [(v) => !!v || "Description is required"],
  },
  {
    key: "type",
    label: "Type",
    type: "auto-complete",
    rules: [(v) => !!v || "Type is required"],
    items: ["Shastrachudamani", "Vidyavaridhi", "Traditional Study"],
  },
  {
    key: "year",
    label: "Year",
    type: "text",
  },
];

const scholarHeaders = [
  {
    key: "name",
    title: "Name",
  },
  {
    key: "description",
    title: "Description",
  },
  {
    key: "type",
    title: "Type",
  },
  {
    key: "year",
    title: "Year",
  },
  {
    key: "actions",
    title: "Actions",
  },
];
</script>
