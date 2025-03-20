<template>
  <div style="background-color: white" class="ma-4 pa-2"></div>
</template>

<script setup>
useSeoMeta({
  title: "Bank Information",
  description: "Bank Information",
  ogTitle: "Bank Information",
  ogDescription: "Bank Information",
  twitterTitle: "Bank Information",
  twitterDescription: "Bank Information",
});

import contributeHeader from "./contributeHeader.vue";

const tableKeys = [
  "Our Name",
  "Bank",
  "S.B.Account No.",
  "IFSC CODE",
  "MICR NO.",
];

const bankDetailsData = await queryContent("contribute", "bankinfo").findOne();

const bankDetails = bankDetailsData.body[0];

// {
//     "id": "THE KUPPUSWAMI SASTRI RESEARCH INSTITUTE.",
//     "name": "THE KUPPUSWAMI SASTRI RESEARCH INSTITUTE.",
//     "bankName": "Union Bank of India, Mylapore Branch",
//     "accountNo": "395702010007408",
//     "ifsc": "UBIN0539571",
//     "micr": "600026009"
//   }

let bankInfo = {
  "our Name": bankDetails.name,
  Bank: bankDetails.bankName,
  "S.B.Account No.": bankDetails.accountNo,
  "IFSC CODE": bankDetails.ifsc,
  "MICR NO.": bankDetails.micr,
};

const bankDetailsKeys = Object.keys(bankInfo);
</script>
