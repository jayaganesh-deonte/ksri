<template>
  <generic-crud
    entityName="Supervisor"
    :apiEndpoint="apiEndpoint"
    :entityFields="galleryCollectionFields"
    :headers="headers"
    :addIdToPayload="true"
  />
</template>

<script setup>
const apiEndpoint = import.meta.env.VITE_API_URL + "/supervisor";

const galleryCollectionFields = [
  {
    key: "name",
    label: "Name",
    type: "text",
    rules: [(v) => !!v || "Name is required"],
    editDisabled: true,
  },
];

const headers = [
  { title: "Name", key: "name" },
  { title: "Actions", key: "actions", sortable: false },
];
</script>
