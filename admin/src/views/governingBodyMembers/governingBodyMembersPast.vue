<!-- <template>
  <generic-crud
    entityName="Governing Body Members Past"
    :apiEndpoint="apiEndpoint"
    :entityFields="endowmentFields"
    :headers="endowmentHeaders"
    :addIdToPayload="true"
  />
</template>

<script setup>
const apiEndpoint =
   "/governing-body-members-past";

const endowmentFields = [
  {
    key: "name",
    label: "Name",
    type: "text",
    rules: [(v) => !!v || "Name is required"],
    // editDisabled: true,
  },
  {
    key: "itemPublishStatus",
    label: "Publish Status",
    type: "auto-complete",
    rules: [(v) => !!v || "Publish Status is required"],
    items: ["PUBLISHED", "DRAFT"],
  },
  {
    key: "startYear",
    label: "Start Year",
    type: "text",
    rules: [(v) => !!v || "Start Year is required"],
  },
  {
    key: "endYear",
    label: "End Year",
    type: "text",
    rules: [(v) => !!v || "End Year is required"],
  },
  {
    key: "designation",
    label: "Designation",
    type: "auto-complete",
    rules: [(v) => !!v || "Designation is required"],
    items: [
      "Presidents",
      "Vice-Presidents",
      "Secretaries",
      "Treasurers",
      "Trustees",
      "Members",
    ],
  },
];

const endowmentHeaders = [
  { title: "Name", key: "name" },
  { title: "Start Year", key: "startYear" },
  { title: "End Year", key: "endYear" },
  { title: "Designation", key: "designation" },
  { title: "Actions", key: "actions", sortable: false },
];
</script> -->
