<template>
  <generic-crud
    entityName="Governing Body Members"
    :apiEndpoint="apiEndpoint"
    :entityFields="endowmentFields"
    :headers="endowmentHeaders"
    :addIdToPayload="true"
    :sortBy="[{ key: 'orderId', order: 'asc' }]"
  />
</template>

<script setup>
const apiEndpoint = "/governing-body-members";

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
  {
    key: "designationStatus",
    label: "Designation Status",
    type: "auto-complete",
    rules: [(v) => !!v || "Designation Status is required"],
    items: ["Present", "Past"],
  },
  {
    key: "startYear",
    label: "Start Year",
    type: "text",
  },
  {
    key: "endYear",
    label: "End Year",
    type: "text",
  },
];

const endowmentHeaders = [
  { title: "Order ID", key: "orderid" },
  { title: "Name", key: "name" },
  { title: "Subtitle", key: "subtitle" },
  { title: "Designation", key: "designation" },
  { title: "Designation Status", key: "designationStatus" },
  { title: "Start Year", key: "startYear" },
  { title: "End Year", key: "endYear" },
  { title: "Actions", key: "actions", sortable: false },
];
</script>
