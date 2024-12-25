<template>
  <div>
    <div class="text-center" v-if="isLoading">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
    </div>
    <generic-crud
      v-else
      entityName="Books"
      :apiEndpoint="apiEndpoint"
      :entityFields="bookFields"
      :headers="bookHeaders"
      :addIdToPayload="true"
    />
  </div>
</template>

<script setup>
const apiEndpoint = import.meta.env.VITE_API_URL + "/publications/books";
import { getUserIdToken } from "@/services/auth";
import axios from "axios";
import { ref } from "vue";

const getAdditionalPublications = async () => {
  const apiUrl =
    import.meta.env.VITE_API_URL + "/publications/additionalPublications";
  const token = await getUserIdToken();

  const response = await axios.get(apiUrl, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (response.status === 200) {
    // order by orderId
    response.data.sort((a, b) => a.orderId - b.orderId);

    // get names only
    return response.data.map((publication) => publication.name);
  } else {
    return [];
  }
};

let isLoading = ref(true);

const additionalPublications = await getAdditionalPublications();

const allPublications = ["KSRI", ...additionalPublications];

const bookFields = [
  {
    key: "title",
    label: "Title",
    type: "text",
    rules: [(v) => !!v || "Title is required"],
    editDisabled: true,
  },
  // author
  {
    key: "author",
    label: "Author",
    type: "text",
    rules: [(v) => !!v || "Author is required"],
  },
  {
    key: "subtitle",
    label: "Subtitle",
    type: "text",
    rules: [(v) => !!v || "Subtitle is required"],
  },
  {
    key: "price",
    label: "Price",
    type: "text",
    rules: [(v) => !!v || "Price is required"],
  },
  {
    key: "details",
    label: "Details",
    type: "text-area",
  },
  {
    key: "available",
    label: "Available",
    type: "auto-complete",
    items: ["Yes", "No"],
    rules: [(v) => !!v || "Available is required"],
  },
  {
    key: "publication",
    label: "Publication",
    type: "auto-complete",
    rules: [(v) => !!v || "Publication is required"],
    items: allPublications,
  },
  {
    key: "yearOfPublication",
    label: "Year of Publication",
    type: "text",
    rules: [(v) => !!v || "Year of Publication is required"],
  },
  {
    key: "copies",
    label: "Available Number of Copies",
    type: "number",
    rules: [(v) => !!v || "Available Number of Copies is required"],
  },
  {
    key: "imageUrls",
    label: "Image URLs",
    type: "image",
    rules: [(v) => !!v || "Image URLs are required"],
  },
];

const bookHeaders = [
  { title: "Title", key: "title" },
  { title: "Subtitle", key: "subtitle" },
  { title: "Author", key: "author" },
  { title: "Price", key: "price" },
  { title: "Available", key: "available" },
  { title: "Publication", key: "publication" },
  { title: "Available Number of Copies", key: "copies" },
  { title: "Actions", key: "actions", sortable: false },
];

isLoading.value = false;
</script>
