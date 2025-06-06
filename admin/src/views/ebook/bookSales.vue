<template>
  <div v-if="isAuthorized">
    <div class="d-flex justify-space-between align-center mb-4">
      <!-- {{ dateRange.start }} - {{ dateRange.end }} => 2024-03-31 - 2025-03-31 -->
      <div class="d-flex align-center">
        <DateRangePicker @update:dates="handleDates" />
        <!-- search btn -->
        <v-btn class="ml-2" color="primary" @click="searchData">Search</v-btn>
      </div>
    </div>
    <generic-crud
      entityName="EBook Sales"
      :apiEndpoint="apiEndpoint"
      :entityFields="donationFields"
      :headers="donationHeaders"
      :addIdToPayload="true"
      :fixedValues="fixedValues"
      :updateItemPendingForDeployment="false"
      :isEditEnabledForItem="false"
      :isDeleteEnabledForItem="false"
      :sortBy="[{ key: 'orderId', order: 'desc' }]"
      @all-items="hanldeAllItems"
      :queryParams="queryParams"
      ref="CRUD"
      :hideAddButton="true"
    />
  </div>
  <div v-else>
    <AccessDenied />
  </div>
</template>

<script setup>
const apiEndpoint = "/payments/ebook";
import DownloadEbookReceiptPdf from "@/components/DownloadEbookReceiptPdf.vue";

import DateRangePicker from "@/components/DateRangePicker.vue";

import { reactive, ref, computed } from "vue";

const CRUD = ref(null); // Properly define the ref

import { useAppStore } from "@/stores/app";

const checkIfCurrentPageIsAuthorized = () => {
  const appStore = useAppStore();
  // const userGroup = appStore.user.groups;

  const functionality = appStore.user.functionality;
  if (functionality.includes("finance")) {
    return true;
  } else {
    console.error("User doesnt have enough permission, access denied.");
    // Redirect to unauthorized page or show a message
    return false;
  }
};

const isAuthorized = checkIfCurrentPageIsAuthorized();

const fixedValues = {
  paymentType: "Donation",
  itemPublishStatus: "PUBLISHED",
};

const donationFields = [
  {
    key: "donationReceiptPdf",
    label: "Donation Receipt",
    type: "component",
    component: DownloadEbookReceiptPdf,
  },
  // {
  //   key: "paymentType",
  //   label: "Payment Type",
  //   type: "auto-complete",
  //   multiple: false,
  //   items: ["Cash", "UPI", "Debit Card", "Credit Card", "Net Banking"],
  //   rules: [(v) => !!v || "Payment Type is required"],
  // },
  {
    key: "name",
    label: "Name",
    type: "text",
    rules: [(v) => !!v || "Name is required"],
    editDisabled: true,
  },
  // {
  //   key: "orderId",
  //   label: "Order ID",
  //   type: "text",
  //   rules: [(v) => !!v || "Order ID is required"],
  // },
  {
    key: "email",
    label: "Email",
    type: "text",
    rules: [
      (v) => !!v || "Email is required",
      (v) => /.+@.+\..+/.test(v) || "Email must be valid",
    ],
    editDisabled: true,
  },
  {
    key: "phoneNumber",
    label: "Phone Number",
    type: "text",
    rules: [(v) => !!v || "Phone Number is required"],
    editDisabled: true,
  },
  {
    key: "amount",
    label: "Amount in INR",
    type: "number",
    rules: [(v) => !!v || "Amount is required"],
    editDisabled: true,
  },
  {
    key: "paymentDate",
    label: "Payment Date",
    type: "date",
    rules: [(v) => !!v || "Payment Date is required"],
    editDisabled: true,
  },
  {
    key: "paymentStatus",
    label: "Payment Status",
    type: "auto-complete",
    rules: [(v) => !!v || "Payment Status is required"],
    items: ["PENDING", "COMPLETED", "FAILED"],
    editDisabled: true,
  },

  {
    key: "paymentRefId",
    label: "Payment Reference ID",
    type: "text",
    rules: [(v) => !!v || "Payment Reference ID is required"],
    editDisabled: true,
  },
  {
    key: "paymentMethod",
    label: "Payment Method",
    type: "auto-complete",
    items: [
      "Cash",
      "UPI",
      "Debit Card",
      "Credit Card",
      "Net Banking",
      "Cheque/DD",
    ],
    rules: [(v) => !!v || "Payment Method is required"],
    editDisabled: true,
  },
  // {
  //   key: "itemPublishStatus",
  //   label: "Publish Status",
  //   type: "auto-complete",
  //   rules: [(v) => !!v || "Publish Status is required"],
  //   items: ["PUBLISHED", "DRAFT"],
  // },
  {
    key: "bookName",
    label: "Book Name",
    type: "text",
    rules: [(v) => !!v || "Book Name is required"],
    editDisabled: true,
  },
  {
    key: "bookId",
    label: "Book ID",
    type: "text",
    editDisabled: true,
  },
  // {
  //   key: "passportNumber",
  //   label: "Passport Number",
  //   type: "text",
  //   editDisabled: true,
  // },
  // {
  //   key: "passportExpiryDate",
  //   label: "Passport Expiry Date",
  //   type: "date",
  //   editDisabled: true,
  // },
  {
    key: "address",
    label: "Address",
    type: "text",
    rules: [(v) => !!v || "Address is required"],
    editDisabled: true,
  },
  {
    key: "city",
    label: "City",
    type: "text",
    rules: [(v) => !!v || "City is required"],
    editDisabled: true,
  },
  {
    key: "state",
    label: "State",
    type: "text",
    rules: [(v) => !!v || "State is required"],
    editDisabled: true,
  },

  {
    key: "country",
    label: "Country",
    type: "text",
    rules: [(v) => !!v || "Country is required"],
    editDisabled: true,
  },
  {
    key: "zip",
    label: "ZIP Code",
    type: "text",
    rules: [(v) => !!v || "ZIP Code is required"],
    editDisabled: true,
  },
];

const donationHeaders = [
  {
    key: "orderId",
    title: "Order ID",
  },
  {
    key: "paymentRefId",
    title: "Payment Ref ID",
  },
  {
    key: "name",
    title: "Name",
  },
  {
    key: "amount",
    title: "Amount",
  },
  {
    key: "paymentDate",
    title: "Payment Date",
  },
  {
    key: "paymentStatus",
    title: "Payment Status",
  },

  {
    key: "email",
    title: "Email",
  },
  {
    key: "bookName",
    title: "Book Name",
  },
  {
    key: "paymentMethod",
    title: "Payment Method",
  },
  {
    key: "metadata",
    title: "Created By",
    value: (item) => `${item.metadata ? item.metadata.created_by : "System"}`,
  },

  {
    key: "actions",
    title: "Actions",
  },
];

let donationData = reactive([]);
let isDisabled = ref(true);

let dateRange = reactive({});

// computed query params
const queryParams = computed(() => {
  return {
    startDate: dateRange.start ? dateRange.start : null,
    endDate: dateRange.end ? dateRange.end : null,
  };
});

const searchData = () => {
  // Use the ref directly without this.$refs
  if (CRUD.value) {
    CRUD.value.fetchItems();
  }
};

const handleDates = (dates) => {
  console.log("handleDates dates 1", dates);
  Object.assign(dateRange, dates);
};

const hanldeAllItems = (items) => {
  // console.log("all items", items);
  Object.assign(donationData, items);
  isDisabled.value = items.length === 0;
};
</script>
