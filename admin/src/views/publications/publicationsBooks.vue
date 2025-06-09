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
      :sortBy="[{ key: 'orderId', order: 'asc' }]"
    />
  </div>
</template>

<script setup>
const apiEndpoint = "/publications/books";
import axiosInstance from "@/axios";
import { ref } from "vue";

const getAdditionalPublications = async () => {
  const apiUrl = "/publications/additionalPublications";

  const response = await axiosInstance.get(apiUrl);
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
  },
  {
    key: "itemPublishStatus",
    label: "Publish Status",
    type: "auto-complete",
    rules: [(v) => !!v || "Publish Status is required"],
    items: ["PUBLISHED", "DRAFT"],
  },
  // printStatus
  {
    key: "printStatus",
    label: "Print Status",
    type: "auto-complete",
    rules: [(v) => !!v || "Print Status is required"],
    items: ["Printed", "Upcoming"],
  },
  // author
  {
    key: "author",
    label: "Author",
    type: "text",
    // rules: [(v) => !!v || "Author is required"],
  },
  {
    key: "subtitle",
    label: "Subtitle",
    type: "text",
    // rules: [(v) => !!v || "Subtitle is required"],
  },
  {
    key: "price",
    label: "Price",
    type: "text",
    // rules: [(v) => !!v || "Price is required"],
  },
  {
    key: "details",
    label: "Details",
    type: "editor",
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
    label: "Date of Publication",
    type: "date",
    // rules: [(v) => !!v || "Year of Publication is required"],
  },
  {
    key: "copies",
    label: "Available Number of Copies",
    type: "number",
    // rules: [(v) => !!v || "Available Number of Copies is required"],
  },
  {
    key: "keywords",
    label: "Search Keywords",
    type: "text",
    rules: [(v) => !!v || "Search Keywords is required"],
  },
  {
    key: "imageUrls",
    label: "Image URLs",
    type: "image",
    rules: [(v) => !!v || "Image URLs are required"],
  },
  {
    key: "isEbookAvailable",
    label: "Ebook Available",
    type: "auto-complete",
    items: ["Yes", "No"],
    rules: [(v) => !!v || "Ebook Available is required"],
  },
  {
    key: "ebookPrice",
    label: "Ebook Price in Rupees",
    type: "number",
    // rules: [(v) => !!v || "Ebook Price is required"],
  },
  {
    key: "ebookUrl",
    label: "Ebook",
    type: "ebook",
    isPreviewFile: false,
    // rules: [],
  },
  {
    key: "previewEbookUrl",
    label: "Preview Ebook",
    type: "ebook",
    isPreviewFile: true,
    // rules: [],
  },
];

const bookHeaders = [
  { title: "Title", key: "title" },
  { title: "Subtitle", key: "subtitle" },
  { title: "Author", key: "author" },
  { title: "Price", key: "price" },
  { title: "Available", key: "available" },
  { title: "Publication", key: "publication" },
  { title: "Date of Publication", key: "yearOfPublication" },
  { title: "Print Status", key: "printStatus" },
  { title: "Available Number of Copies", key: "copies" },
  { title: "Actions", key: "actions", sortable: false },
];

isLoading.value = false;
</script>
