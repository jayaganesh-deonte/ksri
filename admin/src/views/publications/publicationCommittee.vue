<template>
  <generic-crud
    entityName="Publication Committee"
    :apiEndpoint="apiEndpoint"
    :entityFields="editorialFields"
    :headers="editorialHeaders"
    :addIdToPayload="true"
  />
</template>

<script setup>
const apiEndpoint =
  import.meta.env.VITE_API_URL + "/publications/committee-members";

const editorialFields = [
  {
    key: "name",
    label: "Name",
    type: "text",
    rules: [(v) => !!v || "Name is required"],
    editDisabled: true,
  },
  {
    key: "designation",
    label: "Designation",
    type: "auto-complete",
    items: ["Research Committee", "Editorial Committee"],
    rules: [(v) => !!v || "Designation is required"],
  },
];

const editorialHeaders = [
  { title: "Name", key: "name" },
  { title: "Designation", key: "designation" },
  { title: "Actions", key: "actions", sortable: false },
];
</script>
