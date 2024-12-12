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
const apiEndpoint = import.meta.env.VITE_API_URL + "/marqueetexts";

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
    rules: [
      (v) => !!v || "Link is required",
      (v) => /^\//.test(v) || "Link must be a relative path starting with /",
    ],
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
