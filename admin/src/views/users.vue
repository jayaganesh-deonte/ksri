<template>
  <generic-crud
    v-if="isAuthorized"
    entityName="Users"
    :apiEndpoint="apiEndpoint"
    :entityFields="userFields"
    :headers="userHeaders"
    :addIdToPayload="true"
  />
  <div v-else>
    <AccessDenied />
  </div>
</template>

<script setup>
const apiEndpoint = "/users";

import { useAppStore } from "@/stores/app";

const checkIfCurrentPageIsAuthorized = () => {
  const appStore = useAppStore();
  const userGroup = appStore.user.groups;

  // if userGroup contains "super_admin" then allow access to the page
  if (userGroup.includes("super_admin")) {
    console.log("User is super_admin, access granted.");
    return true;
  } else {
    console.log("User is not super_admin, access denied.");
    // Redirect to unauthorized page or show a message
    return false;
  }
};

const isAuthorized = checkIfCurrentPageIsAuthorized();

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
    // rules: [
    //   (v) => !!v || "Phone Number is required",
    //   (v) => v.length <= 10 || "Phone Number must be 10 characters or less",
    // ],
  },
  {
    key: "group",
    label: "Group",
    type: "auto-complete",
    items: ["admin", "super_admin", "read_only"],

    rules: [(v) => !!v || "Group is required"],
  },
  {
    key: "userRoles",
    label: "User Roles",
    type: "auto-complete",
    multiple: true,
    items: ["finance"],
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
