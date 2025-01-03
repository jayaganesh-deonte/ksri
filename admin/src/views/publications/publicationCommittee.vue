<template>
  <generic-crud
    entityName="Publication Committee"
    :apiEndpoint="apiEndpoint"
    :entityFields="editorialFields"
    :headers="editorialHeaders"
    :addIdToPayload="true"
    :sortBy="[{ key: 'orderId', order: 'asc' }]"
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
    // editDisabled: true,
  },
  {
    key: "designation",
    label: "Designation",
    type: "auto-complete",
    items: ["Research Committee", "Editorial Committee"],
    rules: [(v) => !!v || "Designation is required"],
  },
  {
    key: "itemPublishStatus",
    label: "Publish Status",
    type: "auto-complete",
    rules: [(v) => !!v || "Publish Status is required"],
    items: ["PUBLISHED", "DRAFT"],
  },
  {
    key: "orderId",
    label: "Order Id",
    type: "number",
    rules: [(v) => !!v || "Order Id is required"],
    // editDisabled: true,
  },
];

const editorialHeaders = [
  { title: "Order Id", key: "orderId" },
  { title: "Name", key: "name" },
  { title: "Designation", key: "designation" },
  { title: "Actions", key: "actions", sortable: false },
];
</script>
