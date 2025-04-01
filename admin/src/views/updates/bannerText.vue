<template>
  <generic-crud
    entityName="Banner Text"
    :apiEndpoint="apiEndpoint"
    :entityFields="marqueeTextFields"
    :headers="marqueeTextHeaders"
    :addIdToPayload="true"
  />
</template>

<script setup>
const apiEndpoint = "/marqueetexts";

const marqueeTextFields = [
  {
    key: "name",
    label: "Marquee Text",
    type: "text",
    rules: [
      (v) => !!v || "Marquee text is required",
      (v) => v.length <= 100 || "Marquee text must be 100 characters or less",
    ],
  },
  {
    key: "link",
    label: "Link",
    type: "text",
    rules: [(v) => !!v || "Link is required"],
  },
  {
    key: "itemPublishStatus",
    label: "Publish Status",
    type: "auto-complete",
    rules: [(v) => !!v || "Publish Status is required"],
    items: ["PUBLISHED", "DRAFT"],
  },
];

const marqueeTextHeaders = [
  {
    key: "name",
    title: "Marquee Text",
  },
  {
    key: "link",
    title: "Link",
  },
  {
    key: "actions",
    title: "Actions",
  },
];
</script>
