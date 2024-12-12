<template>
  <generic-crud
    entityName="Gallery"
    :apiEndpoint="apiEndpoint"
    :entityFields="galleryFields"
    :headers="galleryHeaders"
    :addIdToPayload="true"
  />
</template>

<script setup>
const apiEndpoint = import.meta.env.VITE_API_URL + "/gallery";

// {
//   "imageUrl": "https://d30y75l38k1y9.cloudfront.net/upload/1-J4t.jpg",
//   "description": "Golden Jubilee Inauguration  - 1994",
//   "collection": "KSRI Gallery Collection 2"
// }
const galleryFields = [
  {
    key: "imageUrl",
    label: "Image",
    type: "image",
    rules: [(v) => !!v || "Image is required"],
  },
  {
    key: "description",
    label: "Description",
    type: "text",
    rules: [(v) => !!v || "Description is required"],
  },
  {
    key: "collection",
    label: "Collection",
    type: "text",
    rules: [(v) => !!v || "Collection is required"],
  },
];

const galleryHeaders = [
  {
    key: "description",
    title: "Description",
  },
  {
    key: "collection",
    title: "Collection",
  },
  { key: "actions", title: "Actions" },
];
</script>
