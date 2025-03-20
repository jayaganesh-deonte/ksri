<template>
  <generic-crud
    entityName="Gallery Collections"
    :apiEndpoint="apiEndpoint"
    :entityFields="galleryCollectionFields"
    :headers="headers"
    :addIdToPayload="true"
  />
</template>

<script setup>
const apiEndpoint = "/gallery/collections";

const galleryCollectionFields = [
  {
    key: "name",
    label: "Name",
    type: "text",
    rules: [(v) => !!v || "Name is required"],
    // editDisabled: true,
  },
  {
    key: "orderId",
    label: "Order Id",
    type: "number",
    rules: [(v) => !!v || "Order Id is required"],
    // editDisabled: true,
  },
  {
    key: "itemPublishStatus",
    label: "Publish Status",
    type: "auto-complete",
    rules: [(v) => !!v || "Publish Status is required"],
    items: ["PUBLISHED", "DRAFT"],
  },
];

const headers = [
  { title: "Name", key: "name" },
  { title: "Order Id", key: "orderId" },
  { title: "Actions", key: "actions", sortable: false },
];
</script>
