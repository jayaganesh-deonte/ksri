<template>
  <div>
    <v-btn
      @click="generatePDF"
      :disabled="editedItem.paymentStatus != 'COMPLETED'"
      color="primary"
    >
      Download Receipt PDF
    </v-btn>
  </div>
</template>

<script setup>
// get editedItem from props
let { editedItem } = defineProps(["editedItem"]);

const generatePDF = () => {
  console.log("generatePDF", editedItem);
  if (editedItem.paymentStatus != "COMPLETED") {
    return;
  }
  const url =
    "https://preview.ksri.in/public/receipt/ebook?emailId=" +
    editedItem.email +
    "&paymentRefId=" +
    editedItem.paymentRefId;

  console.log("url", url);

  window.open(url, "_blank");
};
</script>
