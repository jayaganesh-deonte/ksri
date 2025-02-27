<template>
  <generic-crud
    entityName="Donation"
    :apiEndpoint="apiEndpoint"
    :entityFields="donationFields"
    :headers="donationHeaders"
    :addIdToPayload="true"
    :fixedValues="fixedValues"
    :updateItemPendingForDeployment="false"
    :isEditEnabledForItem="false"
    :isDeleteEnabledForItem="false"
  />
</template>

<script setup>
const apiEndpoint = "/payments/manual";
// import DonationReceiptPdf from "@/components/DonationReceiptPdf.vue";

const fixedValues = {
  paymentType: "Donation",
  itemPublishStatus: "PUBLISHED",
};

const donationFields = [
  // {
  //   key: "donationReceiptPdf",
  //   label: "Donation Receipt",
  //   type: "component",
  //   component: DonationReceiptPdf,
  // },
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
    key: "panNumber",
    label: "PAN Number",
    type: "text",
    rules: [(v) => !!v || "PAN Number is required"],
    editDisabled: true,
  },
  {
    key: "aadharNumber",
    label: "Aadhar Number",
    type: "text",
    editDisabled: true,
  },
  {
    key: "passportNumber",
    label: "Passport Number",
    type: "text",
    editDisabled: true,
  },
  {
    key: "passportExpiryDate",
    label: "Passport Expiry Date",
    type: "date",
    editDisabled: true,
  },
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
  // {
  //   key: "phoneNumber",
  //   title: "Phone Number",
  // },

  {
    key: "paymentMethod",
    title: "Payment Method",
  },

  {
    key: "actions",
    title: "Actions",
  },
];
</script>
