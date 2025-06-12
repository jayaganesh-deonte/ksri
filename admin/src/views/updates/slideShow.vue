<template>
  <generic-crud
    entityName="Slide Show"
    :apiEndpoint="apiEndpoint"
    :entityFields="eventsFields"
    :headers="eventsHeaders"
    :addIdToPayload="true"
  />
</template>

<script setup>
const apiEndpoint = "/slideshow";

const eventsFields = [
  {
    key: "orderId",
    label: "Order Id",
    type: "text",
    rules: [(v) => !!v || "orderId is required"],
  },
  {
    key: "titleText",
    label: "Title Text",
    type: "text",
  },
  {
    key: "descriptionText",
    label: "Description Text",
    type: "text",
  },
  {
    key: "buttonText1",
    label: "Button 1 Text",
    type: "text",
  },
  {
    key: "buttonText1Route",
    label: "Button 1 Route",
    type: "text",
  },
  {
    key: "buttonText2",
    label: "Button 2 Text",
    type: "text",
  },
  {
    key: "buttonText2Route",
    label: "Button 2 Route",
    type: "text",
  },
  {
    key: "itemPublishStatus",
    label: "Publish Status",
    type: "auto-complete",
    rules: [(v) => !!v || "Publish Status is required"],
    items: ["PUBLISHED", "DRAFT"],
  },
  {
    key: "image",
    label: "Event Images",
    type: "image",
    rules: [(v) => !!v || "At least one image is required"],
  },
];

const eventsHeaders = [
  {
    key: "orderId",
    title: "Order ID",
  },
  {
    key: "titleText",
    title: "Title Text",
  },
  {
    key: "descriptionText",
    title: "Description Text",
  },
  {
    key: "actions",
    title: "Actions",
  },
];
</script>
