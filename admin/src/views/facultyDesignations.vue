<template>
  <generic-crud
    entityName="Faculty Designation"
    :apiEndpoint="apiEndpoint"
    :entityFields="facultyFields"
    :headers="facultyHeaders"
    :addIdToPayload="true"
  />
</template>

<script setup>
const apiEndpoint = import.meta.env.VITE_API_URL + "/faculty/designation";

// {
//     id, name, orderId
// }
const facultyFields = [
  //
  {
    key: "orderId",
    label: "Order Id",
    type: "number",
    rules: [(v) => !!v || "Order Id is required"],
    // editDisabled: true,
  },
  {
    key: "type",
    label: "Type",
    type: "auto-complete",
    items: ["ACADEMIC", "NON ACADEMIC"],
    rules: [(v) => !!v || "Type is required"],
  },
  {
    key: "name",
    label: "Name",
    type: "text",
    rules: [(v) => !!v || "Name is required"],
    editDisabled: true,
  },
  {
    key: "itemPublishStatus",
    label: "Publish Status",
    type: "auto-complete",
    rules: [(v) => !!v || "Publish Status is required"],
    items: ["PUBLISHED", "DRAFT"],
  },
];

const facultyHeaders = [
  {
    key: "orderId",
    title: "Order Id",
  },
  {
    key: "type",
    title: "Type",
  },
  {
    key: "name",
    title: "Name",
  },

  { key: "actions", title: "Actions" },
];
</script>
