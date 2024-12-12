<template>
  <generic-crud
    entityName="News"
    :apiEndpoint="apiEndpoint"
    :entityFields="newsFields"
    :headers="newsHeaders"
    :addIdToPayload="true"
  />
</template>

<script setup>
const apiEndpoint = import.meta.env.VITE_API_URL + "/news";

const newsFields = [
  {
    key: "heading",
    label: "Heading",
    type: "text",
    rules: [(v) => !!v || "Heading is required"],
  },
  {
    key: "title",
    label: "Title",
    type: "textarea",
    rules: [(v) => !!v || "Title is required"],
    editDisabled: true,
  },
  {
    key: "text",
    label: "News Content",
    type: "textarea",
    rules: [(v) => !!v || "News Content is required"],
  },
  {
    key: "avatarImage",
    label: "Avatar Image",
    type: "image",
    rules: [(v) => !!v || "Avatar Image is required"],
  },
  {
    key: "heading_image_url",
    label: "Heading Image",
    type: "image",
    rules: [(v) => !!v || "Heading Image is required"],
  },
  {
    key: "images",
    label: "Additional Images",
    type: "image",
    rules: [(v) => (v && v.length > 0) || "At least one image is required"],
  },
];

const newsHeaders = [
  {
    key: "heading",
    title: "Heading",
  },
  {
    key: "title",
    title: "Title",
  },
  {
    key: "text",
    title: "News Content",
  },
  {
    key: "actions",
    title: "Actions",
  },
];
</script>
