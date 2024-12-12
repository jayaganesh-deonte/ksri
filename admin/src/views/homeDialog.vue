<template>
  <generic-crud
    entityName="Home Dialog"
    :apiEndpoint="apiEndpoint"
    :entityFields="homeDialogFields"
    :headers="homeDialogHeaders"
    :addIdToPayload="true"
  />
</template>

<script setup>
// import { ref } from "vue";

const apiEndpoint = import.meta.env.VITE_API_URL + "/homeDialog";

const homeDialogFields = [
  {
    key: "title",
    label: "Title",
    type: "text",
    rules: [(v) => !!v || "Title is required"],
  },
  {
    key: "description",
    label: "Description",
    type: "textarea",
    rules: [(v) => !!v || "Description is required"],
  },
  {
    key: "buttonText",
    label: "Button Text",
    type: "text",
    rules: [(v) => !!v || "Button Text is required"],
  },
  {
    key: "buttonLink",
    label: "Button Link",
    type: "text",
    rules: [
      (v) => !!v || "Button Link is required",
      (v) => /^\//.test(v) || "Link must be a relative path starting with /",
    ],
  },
];

const homeDialogHeaders = [
  {
    key: "title",
    title: "Title",
  },
  {
    key: "description",
    title: "Description",
  },
  {
    key: "buttonText",
    title: "Button Text",
  },
  {
    key: "actions",
    title: "Actions",
  },
];
</script>
