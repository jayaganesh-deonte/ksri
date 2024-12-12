<template>
  <generic-crud
    entityName="Users"
    :apiEndpoint="apiEndpoint"
    :entityFields="userFields"
    :headers="userHeaders"
    :addIdToPayload="true"
  />
</template>

<script setup>
const apiEndpoint = import.meta.env.VITE_API_URL + "/users";

// {
//     "name":"jayaganesh",
//     "id":"jayaganesh",
//     "email": "jaaganesh@gmail.com",
//     "phoneNumber": "12343",
//     "group": "super-admin",
//     "displayImage": [
//         "fdsfsd"
//     ]
// }

const userFields = [
  {
    key: "name",
    label: "Name",
    type: "text",
    rules: [(v) => !!v || "Name is required"],
    editDisabled: true,
  },
  {
    key: "email",
    label: "Email",
    type: "text",
    rules: [
      (v) => !!v || "Email is required",
      (v) => /.+@.+\..+/.test(v) || "E-mail must be valid",
    ],
  },
  {
    key: "phoneNumber",
    label: "Phone Number",
    type: "text",
    rules: [
      (v) => !!v || "Phone Number is required",
      (v) => v.length <= 10 || "Phone Number must be 10 characters or less",
    ],
  },
  {
    key: "group",
    label: "Group",
    type: "auto-complete",
    items: [
      "ksri_admin_group",
      "ksri_super_admin_group",
      "ksri_read_only_group",
    ],

    rules: [(v) => !!v || "Group is required"],
  },
  {
    key: "displayImage",
    label: "Display Image",
    type: "image",
    rules: [(v) => !!v || "Display Image is required"],
  },
];

const userHeaders = [
  {
    key: "name",
    title: "Name",
  },
  {
    key: "email",
    title: "Email",
  },
  {
    key: "phoneNumber",
    title: "Phone Number",
  },
  {
    key: "group",
    title: "Group",
  },
  {
    key: "actions",
    title: "Actions",
  },
];
</script>
