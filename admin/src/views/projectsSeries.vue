<template>
  <generic-crud
    entityName="Project Series"
    :apiEndpoint="apiEndpoint"
    :entityFields="projectFields"
    :headers="projectHeaders"
    :addIdToPayload="true"
  />
</template>

<script setup>
const apiEndpoint = import.meta.env.VITE_API_URL + "/project/series";

const projectFields = [
  {
    key: "name",
    label: "Name",
    type: "text",
    rules: [(v) => !!v || "Name is required"],
    editDisabled: true,
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
  },

  {
    key: "orderId",
    label: "Order Id",
    type: "text",
    rules: [(v) => !!v || "orderId is required"],
  },
  {
    key: "subSeries",
    label: "Sub Series",
    isArray: true,
    fields: [
      {
        key: "name",
        label: "Name",
        type: "text",
      },
    ],
  },
];

const projectHeaders = [
  {
    key: "name",
    title: "Name",
  },
  {
    key: "description",
    title: "Description",
  },
  {
    key: "subSeries",
    title: "Sub Series",
    value: (item) => {
      return item.subSeries.map((sub) => sub.name).join(", ");
    },
  },
  { key: "orderId", title: "Order Id" },
  { key: "actions", title: "Actions" },
];
</script>
