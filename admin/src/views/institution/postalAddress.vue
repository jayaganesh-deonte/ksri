<template>
  <generic-crud
    entityName="Postal Address"
    :apiEndpoint="apiEndpoint"
    :entityFields="bankInfoFields"
    :headers="bankInfoHeaders"
    :addIdToPayload="true"
  />
</template>

<script setup>
const apiEndpoint = "/contribute/postalAddress";

// [
//     {
//  id
//         "instituteName": "The Kuppuswami Sastri Research Institute",
//         "address": "84, Thiru vi ka Road, Mylapore, Chennai 600 004.",
//         "email": "ksrinst@gmail.com",
//         "phone": "044-24985320"
//     }
// ]

const bankInfoFields = [
  {
    key: "instituteName",
    label: "Institute Name",
    type: "text",
    rules: [(v) => !!v || "instituteName is required"],
  },
  {
    key: "address",
    label: "Address",
    type: "text",
    rules: [(v) => !!v || "Address is required"],
  },
  {
    key: "email",
    label: "Email",
    type: "text",
    rules: [(v) => !!v || "Email is required"],
  },
  {
    key: "phone",
    label: "Phone",
    type: "text",
    rules: [(v) => !!v || "Phone is required"],
  },
  {
    key: "itemPublishStatus",
    label: "Publish Status",
    type: "auto-complete",
    rules: [(v) => !!v || "Publish Status is required"],
    items: ["PUBLISHED", "DRAFT"],
  },
];

const bankInfoHeaders = [
  {
    title: "Institute Name",
    key: "instituteName",
  },
  {
    title: "Address",
    key: "address",
  },
  {
    title: "Email",
    key: "email",
  },
  {
    title: "Phone",
    key: "phone",
  },
  {
    title: "Actions",
    key: "actions",
  },
];
</script>
