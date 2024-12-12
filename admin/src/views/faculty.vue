<template>
  <generic-crud
    entityName="Faculty"
    :apiEndpoint="apiEndpoint"
    :entityFields="facultyFields"
    :headers="facultyHeaders"
    :addIdToPayload="true"
  />
</template>

<script setup>
const apiEndpoint = import.meta.env.VITE_API_URL + "/faculty";

// {
//     "name": "Dr. K.S.Balasubramanian",
//     "designation": "Director",
//     "displayImage": "https://d30y75l38k1y9.cloudfront.net/upload/faculty/dr-k-s-balasubramanian.jpg",
//     "subtitle": "Areas of Specialisation: Yoga, Literature, Philosophy",
//     "description": "More than 35 years of teaching and research experience.\nGuided many Research Scholars to work on Yoga and related fields.",
//     "mobile": "9884899716",
//     "mail": "sanskritkannan@yahoo.com",
//     "profile": "https://d30y75l38k1y9.cloudfront.net/upload/media/Dr.K.S.Balasubramanian.docx"
// }
const facultyFields = [
  {
    key: "name",
    label: "Name",
    type: "text",
    rules: [(v) => !!v || "Name is required"],
    editDisabled: true,
  },
  {
    key: "designation",
    label: "Designation",
    type: "auto-complete",
    items: [
      "Former Director",
      "Director",
      "Deputy Director",
      "Deputy Director/Associate Professor",
      "Assistant Professor",
      "Associate Professor",
    ],
  },

  {
    key: "subtitle",
    label: "Areas of Specialisation",
    type: "text",
    rules: [(v) => !!v || "Areas of Specialisation is required"],
  },
  {
    key: "description",
    label: "Description",
    type: "textarea",
    rules: [(v) => !!v || "Description is required"],
  },
  {
    key: "mobile",
    label: "Mobile",
    type: "text",
    rules: [(v) => !!v || "Mobile number is required"],
  },
  {
    key: "mail",
    label: "Email",
    type: "text",
    rules: [(v) => !!v || "Email is required"],
  },
  {
    key: "profile",
    label: "Profile Document",
    type: "document",
    rules: [(v) => !!v || "Profile Document is required"],
  },
  {
    key: "displayImage",
    label: "Display Image",
    type: "image",
  },
];

const facultyHeaders = [
  {
    key: "name",
    title: "Name",
  },
  {
    key: "designation",
    title: "Designation",
  },
  {
    key: "subtitle",
    title: "Specialisation",
  },
  {
    key: "description",
    title: "Description",
  },
  {
    key: "mobile",
    title: "Mobile",
  },
  {
    key: "mail",
    title: "Email",
  },
  { key: "actions", title: "Actions" },
];
</script>
