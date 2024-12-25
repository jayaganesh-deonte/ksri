<!-- <template>
  <generic-crud
    entityName="Modern Scholar"
    :apiEndpoint="apiEndpoint"
    :entityFields="scholarFields"
    :headers="scholarHeaders"
    :addIdToPayload="true"
  />
</template>

<script setup>
const apiEndpoint = import.meta.env.VITE_API_URL + "/students";

const scholarFields = [
  {
    key: "name",
    label: "Name",
    type: "text",
    rules: [(v) => !!v || "Name is required"],
    editDisabled: true,
  },
  {
    key: "course",
    label: "Course",
    type: "auto-complete",
    rules: [(v) => !!v || "Course is required"],
    items: ["Ph.D.", "M.Phil."],
  },
  {
    key: "areaOfStudy",
    label: "Area of Study",
    type: "text",
    rules: [(v) => !!v || "Area of Study is required"],
  },
  {
    key: "supervisor",
    label: "Supervisor",
    type: "auto-complete",
    rules: [(v) => !!v || "Supervisor is required"],
    items: ["Dr. S.S. Janaki"],
  },
  {
    key: "status",
    label: "Status",
    type: "auto-complete",
    rules: [(v) => !!v || "Status is required"],
    items: ["On-Going", "Completed"],
  },
];

const scholarHeaders = [
  {
    key: "name",
    title: "Name",
  },
  {
    key: "course",
    title: "Course",
  },
  {
    key: "areaOfStudy",
    title: "Area of Study",
  },
  {
    key: "supervisor",
    title: "Supervisor",
  },
  {
    key: "status",
    title: "Status",
  },
  {
    key: "actions",
    title: "Actions",
  },
];
</script> -->
