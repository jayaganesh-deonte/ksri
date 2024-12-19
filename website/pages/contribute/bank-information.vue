<template>
  <div style="background-color: white" class="ma-4 pa-2">
    <section-title title="Bank Account Information" id="bank-information" />
    <v-row class="my-4">
      <v-col cols="12" sm="12" md="5" data-aos="fade-right">
        <div class="text-h5 font-weight-bold">
          For local contribution the bank particulars are
        </div>
        <div class="text-h6">Bank particulars for local donors</div>
      </v-col>
      <v-col cols="12" sm="12" md="7">
        <!-- add bank Details -->

        <v-table style="background-color: transparent" v-if="!$device.isMobile">
          <tbody>
            <tr
              v-for="(value, key) in bankInfo"
              :key="key"
              class="text-h6"
              data-aos="fade-left"
              :data-aos-delay="`${bankDetailsKeys.indexOf(key) * 100}`"
            >
              <td class="font-weight-bold text-secondary">
                {{ tableKeys[bankDetailsKeys.indexOf(key)] }}
              </td>
              <td>{{ value }}</td>
            </tr>
          </tbody>
        </v-table>

        <v-list
          v-else
          class="text-body-1"
          data-aos="fade-left"
          :data-aos-delay="`${bankDetailsKeys.indexOf(key) * 100}`"
          v-for="(value, key) in bankInfo"
          :key="key"
        >
          <v-list-item>
            <div class="font-weight-bold text-secondary">
              {{ tableKeys[bankDetailsKeys.indexOf(key)] }}
            </div>
            <div>{{ value }}</div>
          </v-list-item>
        </v-list>
      </v-col>
    </v-row>

    <contributeHeader />
  </div>
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
