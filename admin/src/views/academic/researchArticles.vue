<template>
  <generic-crud
    entityName="Research Articles"
    :apiEndpoint="apiEndpoint"
    :entityFields="researchArticlesFields"
    :headers="researchArticlesHeaders"
    :addIdToPayload="true"
  />
</template>

<script setup>
const apiEndpoint = "/researchArticles";

const researchArticlesFields = [
  {
    key: "title",
    label: "Title",
    type: "text",
    rules: [(v) => !!v || "Title is required"],
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
    key: "subTitle",
    label: "Subtitle",
    type: "textarea",
    rules: [(v) => !!v || "Subtitle is required"],
  },
  {
    key: "author",
    label: "Author",
    type: "text",
    rules: [(v) => !!v || "Author is required"],
  },
  {
    key: "link",
    label: "Article Document",
    type: "document",
    rules: [(v) => !!v || "Article document is required"],
  },
];

const researchArticlesHeaders = [
  {
    key: "title",
    title: "Title",
  },
  {
    key: "subTitle",
    title: "Subtitle",
  },
  {
    key: "author",
    title: "Author",
  },

  {
    key: "actions",
    title: "Actions",
  },
];
</script>
