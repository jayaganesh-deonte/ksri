<template>
  <div>
    <v-progress-circular
      v-if="isLoading"
      indeterminate
      color="primary"
    ></v-progress-circular>
    <generic-crud
      v-if="!isLoading"
      entityName="Faculty"
      :apiEndpoint="apiEndpoint"
      :entityFields="facultyFields"
      :headers="facultyHeaders"
      :addIdToPayload="true"
    />
  </div>
</template>

<script setup>
import axios from "axios";
import { getUserIdToken } from "@/services/auth";
import { ref } from "vue";

const apiEndpoint = import.meta.env.VITE_API_URL + "/faculty";

let isLoading = ref(true);

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
const fetchFacultyDesignations = async () => {
  const idToken = await getUserIdToken();

  const response = await axios.get(
    import.meta.env.VITE_API_URL + "/faculty/designation",
    {
      headers: {
        Authorization: `${idToken}`,
      },
    }
  );
  // get only names
  const names = response.data.map((item) => item.name);
  return names;
};

let designations = await fetchFacultyDesignations();
console.log("designations", designations);

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
    key: "name",
    label: "Name",
    type: "text",
    rules: [(v) => !!v || "Name is required"],
    editDisabled: true,
  },
  {
    key: "type",
    label: "Type",
    type: "auto-complete",
    items: ["ACADEMIC", "NON ACADEMIC"],
    rules: [(v) => !!v || "Type is required"],
  },
  {
    key: "designation",
    label: "Designation",
    type: "auto-complete",
    items: designations,
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
    key: "orderId",
    title: "Order Id",
  },
  {
    key: "name",
    title: "Name",
  },
  {
    key: "designation",
    title: "Designation",
  },
  {
    key: "type",
    title: "Type",
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

isLoading.value = false;
</script>
