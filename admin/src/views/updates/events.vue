<template>
  <generic-crud
    entityName="Events"
    :apiEndpoint="apiEndpoint"
    :entityFields="eventsFields"
    :headers="eventsHeaders"
    :addIdToPayload="true"
  />
</template>

<script setup>
const apiEndpoint = "/events";

const eventsFields = [
  {
    key: "title",
    label: "Title",
    type: "text",
    // editDisabled: true,
    rules: [
      (v) => !!v || "Title is required",
      (v) => v.length <= 200 || "Title must be 200 characters or less",
    ],
  },
  {
    key: "itemPublishStatus",
    label: "Publish Status",
    type: "auto-complete",
    rules: [(v) => !!v || "Publish Status is required"],
    items: ["PUBLISHED", "DRAFT"],
  },
  {
    key: "subtitle",
    label: "Subtitle",
    type: "text",
    rules: [
      (v) => !!v || "Subtitle is required",
      (v) => v.length <= 250 || "Subtitle must be 250 characters or less",
    ],
  },
  {
    key: "description",
    label: "Description",
    type: "editor",
    rules: [
      (v) => !!v || "Description is required",
      (v) => v.length <= 1000 || "Description must be 1000 characters or less",
    ],
  },
  {
    key: "category",
    label: "Category",
    type: "auto-complete",
    multiple: true,
    items: ["Events", "Workshops", "Viva", "Lectures", "Seminars"],
    rules: [(v) => !!v || "At least one category is required"],
  },
  {
    key: "venue",
    label: "Venue",
    type: "text",
    rules: [(v) => !!v || "Venue is required"],
  },
  {
    key: "date",
    label: "Event Date",
    type: "date",
    rules: [(v) => !!v || "Date is required"],
  },
  {
    key: "avatarImage",
    label: "Avatar Image",
    type: "image",
    rules: [(v) => !!v || "Avatar Image is required"],
  },
  {
    key: "images",
    label: "Event Images",
    type: "image",
    rules: [(v) => !!v || "At least one image is required"],
  },
];

const eventsHeaders = [
  {
    key: "title",
    title: "Title",
  },
  {
    key: "category",
    title: "Category",
    value: (v) => v.category.join(", "),
  },
  {
    key: "date",
    title: "Date",
  },
  {
    key: "venue",
    title: "Venue",
  },
  {
    key: "actions",
    title: "Actions",
  },
];
</script>
