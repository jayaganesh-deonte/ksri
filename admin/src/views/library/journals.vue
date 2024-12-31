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
  },
  {
    key: "JournalName",
    label: "Journal Name",
    type: "text",
  },
  {
    key: "Nationality",
    label: "Nationality",
    type: "auto-complete",
    items: ["FOREIGN", "LOCAL"],
  },
  {
    key: "subTable",
    label: "Journal Volumes",
    isArray: true,
    fields: [
      {
        key: "PublicationYear",
        label: "Publication Year",
        type: "number",
      },
      {
        key: "Volume",
        label: "Volume",
        type: "number",
      },
      {
        key: "JournalVolumeNumber#",
        label: "Volume Number",
        type: "number",
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
