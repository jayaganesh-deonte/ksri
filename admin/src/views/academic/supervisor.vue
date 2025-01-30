<template>
  <generic-crud
    entityName="Supervisor"
    :apiEndpoint="apiEndpoint"
    :entityFields="galleryCollectionFields"
    :headers="headers"
    :addIdToPayload="true"
    :sortBy="[{ key: 'orderId', order: 'asc' }]"
  />
</template>

<script setup>
const apiEndpoint = "/supervisor";

const galleryCollectionFields = [
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
    key: "orderId",
    label: "Order Id",
    type: "number",
    rules: [(v) => !!v || "Order Id is required"],
    // editDisabled: true,
  },
  {
    key: "noOfphdStudents",
    label: "No of Phd Students",
    type: "text",
    // rules: [(v) => !!v || "No of Phd Students is required"],
  },
  {
    key: "vacancy",
    label: "Vacancy",
    type: "text",
    // rules: [(v) => !!v || "Vacancy is required"],
  },
];

const headers = [
  { title: "Order Id", key: "orderId" },
  { title: "Name", key: "name" },
  { title: "No. of Ph.D. Students", key: "noOfphdStudents" },
  { title: "Vacancy", key: "vacancy" },
  { title: "Actions", key: "actions", sortable: false },
];
</script>
