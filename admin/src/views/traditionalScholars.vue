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
    editDisabled: true,
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
    key: "actions",
    title: "Actions",
  },
];
</script>
