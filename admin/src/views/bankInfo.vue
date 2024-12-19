<template>
  <generic-crud
    entityName="Bank Info"
    :apiEndpoint="apiEndpoint"
    :entityFields="bankInfoFields"
    :headers="bankInfoHeaders"
    :addIdToPayload="true"
  />
</template>

<script setup>
const apiEndpoint = import.meta.env.VITE_API_URL + "/contribute/bankInfo";

const bankInfoFields = [
  {
    key: "name",
    label: "Name",
    type: "text",
    rules: [(v) => !!v || "Name is required"],
    editDisabled: true,
  },
  {
    key: "bankName",
    label: "Bank Name",
    type: "text",
    rules: [(v) => !!v || "Bank Name is required"],
  },
  {
    key: "accountNo",
    label: "Account No",
    type: "text",
    rules: [(v) => !!v || "Account No is required"],
  },
  {
    key: "ifsc",
    label: "IFSC",
    type: "text",
    rules: [(v) => !!v || "IFSC is required"],
  },
  {
    key: "micr",
    label: "MICR",
    type: "text",
    rules: [(v) => !!v || "MICR is required"],
  },
];

const bankInfoHeaders = [
  { title: "Name", key: "name" },
  { title: "Bank Name", key: "bankName" },
  { title: "Account No", key: "accountNo" },
  { title: "IFSC", key: "ifsc" },
  { title: "MICR", key: "micr" },
  { title: "Actions", key: "actions", sortable: false },
];
</script>
