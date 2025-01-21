<template>
  <div>
    <div class="text-center" v-if="isLoading">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
    </div>
    <generic-crud
      v-else
      entityName="Journals"
      :apiEndpoint="apiEndpoint"
      :entityFields="bookFields"
      :headers="bookHeaders"
      :addIdToPayload="true"
      :sortBy="[{ key: 'orderId', order: 'asc' }]"
    />
  </div>
</template>

<script setup>
const apiEndpoint = "/publications/journals";

import { ref } from "vue";

let isLoading = ref(true);

const bookFields = [
  {
    key: "title",
    label: "Title",
    type: "text",
    rules: [(v) => !!v || "Title is required"],
  },
  {
    key: "itemPublishStatus",
    label: "Publish Status",
    type: "auto-complete",
    rules: [(v) => !!v || "Publish Status is required"],
    items: ["PUBLISHED", "DRAFT"],
  },
  // author
  // {
  //   key: "author",
  //   label: "Author",
  //   type: "text",
  //   rules: [(v) => !!v || "Author is required"],
  // },
  {
    key: "subtitle",
    label: "Subtitle",
    type: "text",
    // rules: [(v) => !!v || "Subtitle is required"],
  },
  {
    key: "price",
    label: "Price",
    type: "text",
    // rules: [(v) => !!v || "Price is required"],
  },
  {
    key: "details",
    label: "Details",
    type: "editor",
  },
  {
    key: "available",
    label: "Available",
    type: "auto-complete",
    items: ["Yes", "No"],
    rules: [(v) => !!v || "Available is required"],
  },
  // {
  //   key: "publication",
  //   label: "Publication",
  //   type: "auto-complete",
  //   rules: [(v) => !!v || "Publication is required"],
  //   items: allPublications,
  // },
  {
    key: "yearOfPublication",
    label: "Year of Publication",
    type: "text",
    rules: [(v) => !!v || "Year of Publication is required"],
  },
  {
    key: "copies",
    label: "Available Number of Copies",
    type: "number",
    // rules: [(v) => !!v || "Available Number of Copies is required"],
  },
  {
    key: "keywords",
    label: "Search Keywords",
    type: "text",
    rules: [(v) => !!v || "Search Keywords is required"],
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
  // { title: "Author", key: "author" },
  { title: "Price", key: "price" },
  { title: "Available", key: "available" },
  // { title: "Publication", key: "publication" },
  { title: "Year of Publication", key: "yearOfPublication" },
  { title: "Available Number of Copies", key: "copies" },
  { title: "Actions", key: "actions", sortable: false },
];

isLoading.value = false;
</script>
