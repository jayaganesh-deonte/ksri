<template>
  <generic-crud
    entityName="Governing Body Members"
    :apiEndpoint="apiEndpoint"
    :entityFields="endowmentFields"
    :headers="endowmentHeaders"
    :addIdToPayload="true"
  />
</template>

<script setup>
const apiEndpoint = import.meta.env.VITE_API_URL + "/governing-body-members";

const endowmentFields = [
  {
    key: "name",
    label: "Name",
    type: "text",
    rules: [(v) => !!v || "Name is required"],
    // editDisabled: true,
  },
  {
    key: "orderid",
    label: "ID",
    type: "number",
    rules: [(v) => !!v || "ID is required"],
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
    key: "subtitle",
    label: "Subtitle",
    type: "text",
    rules: [(v) => !!v || "Subtitle is required"],
  },
  {
    key: "designation",
    label: "Designation",
    type: "auto-complete",
    rules: [(v) => !!v || "Designation is required"],
    items: ["President", "Vice President", "Secretary", "Treasurer", "Members"],
  },
];

const endowmentHeaders = [
  { title: "ID", key: "orderid" },
  { title: "Name", key: "name" },
  { title: "Subtitle", key: "subtitle" },
  { title: "Designation", key: "designation" },
  { title: "Actions", key: "actions", sortable: false },
];
</script>
