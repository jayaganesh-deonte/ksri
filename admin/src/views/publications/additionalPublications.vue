<template>
  <generic-crud
    entityName="Additional Publications"
    :apiEndpoint="apiEndpoint"
    :entityFields="editorialFields"
    :headers="editorialHeaders"
    :addIdToPayload="true"
  />
</template>

<script setup>
const apiEndpoint =
  import.meta.env.VITE_API_URL + "/publications/additionalPublications";

const editorialFields = [
  {
    key: "name",
    label: "Name",
    type: "text",
    rules: [(v) => !!v || "Name is required"],
    editDisabled: true,
  },
  {
    key: "orderId",
    label: "Order Id",
    type: "text",
    rules: [(v) => !!v || "Order Id is required"],
    editDisabled: true,
  },
];

const editorialHeaders = [
  { title: "Name", key: "name" },
  { title: "Order Id", key: "orderId" },
  { title: "Actions", key: "actions", sortable: false },
];
</script>
