<template>
  <generic-crud
    entityName="Chair"
    :apiEndpoint="apiEndpoint"
    :entityFields="facultyFields"
    :headers="facultyHeaders"
    :addIdToPayload="true"
    :sortBy="[{ key: 'orderId', order: 'asc' }]"
  />
</template>

<script setup>
const apiEndpoint = import.meta.env.VITE_API_URL + "/chair";

// {
//   id: string;
//   chairName: string;
//   areaOfSpecialization: string;
//   name: string;
//   subTitle: string;
// }
const facultyFields = [
  {
    key: "orderId",
    label: "Order Id",
    type: "number",
    rules: [(v) => !!v || "orderId is required"],
    // editDisabled: true,
  },
  {
    key: "name",
    label: "Name",
    type: "text",
    rules: [(v) => !!v || "Name is required"],
    // editDisabled: true,
  },

  {
    key: "areaOfSpecialization",
    label: "Area of Specialization",
    type: "text",
    rules: [(v) => !!v || "Area of Specialization is required"],
  },

  {
    key: "chairName",
    label: "Chair Name",
    type: "text",
    rules: [(v) => !!v || "Chair Name is required"],
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
    label: "Sub Title",
    type: "text",
    rules: [(v) => !!v || "Sub Title is required"],
  },
  {
    key: "displayImage",
    label: "Display Image",
    type: "image",
  },
];

const facultyHeaders = [
  { key: "orderId", title: "ID" },
  { key: "name", title: "Name" },
  { key: "areaOfSpecialization", title: "Area of Specialization" },
  { key: "chairName", title: "Chair Name" },
  { key: "subTitle", title: "Sub Title" },
  { key: "actions", title: "Actions" },
];
</script>
