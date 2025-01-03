<template>
  <generic-crud
    entityName="Advisory Board"
    :apiEndpoint="apiEndpoint"
    :entityFields="editorialFields"
    :headers="editorialHeaders"
    :addIdToPayload="true"
    :sortBy="[{ key: 'orderId', order: 'asc' }]"
  />
</template>

<script setup>
const apiEndpoint = import.meta.env.VITE_API_URL + "/advisory-board";

const editorialFields = [
  {
    key: "name",
    label: "Name",
    type: "text",
    rules: [(v) => !!v || "Name is required"],
    // editDisabled: true,
  },
  {
    key: "subTitle",
    label: "Sub Title",
    type: "textarea",
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
  { title: "Sub Title", key: "subTitle" },
  { title: "Actions", key: "actions", sortable: false },
];
</script>
