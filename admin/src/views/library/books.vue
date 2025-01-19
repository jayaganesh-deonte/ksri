<template>
  <generic-crud
    entityName="Books"
    :apiEndpoint="apiEndpoint"
    :entityFields="bookFields"
    :headers="bookHeaders"
    :addIdToPayload="true"
    :sortBy="[{ key: 'accessionNo', order: 'asc' }]"
    :fetchItemsWithPagination="true"
  />
</template>

<script setup>
const apiEndpoint = "/library/books";

const bookFields = [
  {
    key: "accessionNo",
    label: "Accession No.",
    type: "text",
    rules: [(v) => !!v || "Accession No. is required"],
  },
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
  {
    key: "author",
    label: "Author",
    type: "text",
  },
  {
    key: "editor",
    label: "Editor",
    type: "text",
  },
  {
    key: "publisher",
    label: "Publisher",
    type: "text",
  },
  {
    key: "remarks",
    label: "Remarks",
    type: "text",
  },
];

const bookHeaders = [
  {
    title: "Accession No.",
    key: "accessionNo",
    value: (item) => parseInt(item.accessionNo),
  },
  { title: "Title", key: "title" },
  { title: "Author", key: "author" },
  { title: "Editor", key: "editor" },
  { title: "Publisher", key: "publisher" },
  { title: "Remarks", key: "remarks" },
  { title: "Actions", key: "actions", sortable: false },
];
</script>
