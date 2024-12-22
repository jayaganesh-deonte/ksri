<template>
  <generic-crud
    entityName="Books"
    :apiEndpoint="apiEndpoint"
    :entityFields="bookFields"
    :headers="bookHeaders"
    :addIdToPayload="true"
  />
</template>

<script setup>
const apiEndpoint = import.meta.env.VITE_API_URL + "/publications/books";

const bookFields = [
  {
    key: "title",
    label: "Title",
    type: "text",
    rules: [(v) => !!v || "Title is required"],
    editDisabled: true,
  },
  {
    key: "subtitle",
    label: "Subtitle",
    type: "text",
    rules: [(v) => !!v || "Subtitle is required"],
  },
  {
    key: "price",
    label: "Price",
    type: "text",
    rules: [(v) => !!v || "Price is required"],
  },
  {
    key: "details",
    label: "Details",
    type: "text-area",
  },
  {
    key: "available",
    label: "Available",
    type: "auto-complete",
    items: ["Yes", "No"],
    rules: [(v) => !!v || "Available is required"],
  },
  {
    key: "publication",
    label: "Publication",
    type: "text",
    rules: [(v) => !!v || "Publication is required"],
  },
  {
    key: "copies",
    label: "Available Number of Copies",
    type: "number",
    rules: [(v) => !!v || "Available Number of Copies is required"],
  },
  {
    key: "imageUrls",
    label: "Image URLs",
    type: "image",
    rules: [(v) => !!v || "Image URLs are required"],
  },
];

const bookHeaders = [
  { title: "Title", key: "title" },
  { title: "Subtitle", key: "subtitle" },
  { title: "Price", key: "price" },
  { title: "Available", key: "available" },
  { title: "Publication", key: "publication" },
  { title: "Available Number of Copies", key: "copies" },
  { title: "Actions", key: "actions", sortable: false },
];
</script>
