<template>
  <generic-crud
    entityName="Journal"
    :apiEndpoint="apiEndpoint"
    :entityFields="entityFields"
    :headers="headers"
    :addIdToPayload="true"
    :expandable="true"
    :fetchItemsWithPagination="true"
    :sortBy="[{ key: 'JournalAccNo', order: 'asc' }]"
  />
</template>

<script setup>
const apiEndpoint = import.meta.env.VITE_API_URL + "/library/journals";

const entityFields = [
  {
    key: "JournalAccNo",
    label: "Journal Acc No",
    type: "number",
    rules: [(v) => !!v || "Journal Acc No is required"],
  },
  {
    key: "JournalName",
    label: "Journal Name",
    type: "text",
    rules: [(v) => !!v || "Journal Name is required"],
  },
  {
    key: "itemPublishStatus",
    label: "Publish Status",
    type: "auto-complete",
    rules: [(v) => !!v || "Publish Status is required"],
    items: ["PUBLISHED", "DRAFT"],
  },
  {
    key: "Nationality",
    label: "Nationality",
    type: "auto-complete",
    items: ["FOREIGN", "LOCAL"],
    rules: [(v) => !!v || "Nationality is required"],
  },
  {
    key: "subTable",
    label: "Journal Volumes",
    isArray: true,
    fields: [
      {
        key: "PublicationYear",
        label: "Publication Year",
        type: "text",
      },
      {
        key: "Volume",
        label: "Volume",
        type: "text",
      },
      {
        key: "JournalVolumeNumber#",
        label: "Volume Number",
        type: "text",
      },
      {
        key: "JournalVolumeNumber",
        label: "Volume Number Text",
        type: "text",
      },
    ],
  },
];

const headers = [
  {
    title: "Journal Acc No",
    key: "JournalAccNo",
    value: (item) => parseInt(item.JournalAccNo),
  },
  { title: "Journal Name", key: "JournalName" },
  { title: "Nationality", key: "Nationality" },
  { title: "Actions", key: "actions", sortable: false },
];
</script>
