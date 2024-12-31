<template>
  <generic-crud
    entityName="Library Articles"
    :apiEndpoint="apiEndpoint"
    :entityFields="articleFields"
    :headers="articleHeaders"
    :addIdToPayload="true"
    :fetchItemsWithPagination="true"
  />
</template>

<script setup>
const apiEndpoint = import.meta.env.VITE_API_URL + "/library/articles";

const articleFields = [
  {
    key: "title",
    label: "Title",
    type: "text",
    rules: [(v) => !!v || "Title is required"],
    editDisabled: true,
  },
  {
    key: "author",
    label: "Author",
    type: "text",
    rules: [(v) => !!v || "Author is required"],
  },
  {
    key: "journal",
    label: "Journal",
    type: "text",
    rules: [(v) => !!v || "Journal is required"],
  },
  {
    key: "volume",
    label: "Volume",
    type: "text",
    rules: [(v) => !!v || "Volume is required"],
  },
  {
    key: "year",
    label: "Year",
    type: "number",
    rules: [(v) => !!v || "Year is required"],
  },
  {
    key: "remarks",
    label: "Remarks",
    type: "text",
  },
];

const articleHeaders = [
  { title: "Title", key: "title" },
  { title: "Author", key: "author" },
  { title: "Journal", key: "journal" },
  { title: "Volume", key: "volume" },
  { title: "Year", key: "year" },
  { title: "Remarks", key: "remarks" },
  { title: "Actions", key: "actions", sortable: false },
];
</script>
