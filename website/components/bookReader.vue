<template>
  <div>
    <div v-if="!store.isAuthenticated">
      <!-- login to buy book -->
      <div class="my-4">
        <v-btn
          rounded="pill"
          variant="flat"
          color="secondary"
          @click="$router.push('/login')"
        >
          Login to buy book
        </v-btn>
      </div>
    </div>
    <div v-if="store.isAuthenticated">
      <div v-if="isBookPurchased">
        <!-- <v-btn rounded="pill" variant="flat" color="secondary" class="mt-1">
          Read Book
        </v-btn> -->
        <Epubreader
          :src="ebookUrl"
          buttonText="Read Book"
          v-if="bookFormatType == 'epub' && ebookUrl != ''"
          :bookId="bookInfo.id"
        />

        <PdfViewer
          :pdfUrl="ebookUrl"
          v-if="bookFormatType == 'pdf' && ebookUrl != ''"
          buttonText="Read Book"
          :bookId="bookInfo.id"
        />
      </div>
      <div v-if="!isBookPurchased">
        <v-btn
          rounded="pill"
          variant="flat"
          color="secondary"
          @click="buyEbook"
          class="mt-1"
          v-if="!isPaymentUrlLoading"
        >
          Buy E-book
        </v-btn>
        <v-btn
          rounded="pill"
          variant="flat"
          color="secondary"
          class="mt-1"
          v-if="isPaymentUrlLoading"
        >
          <v-progress-circular
            class="text-center"
            indeterminate
            color="primary"
          ></v-progress-circular>
        </v-btn>
      </div>
    </div>
  </div>
</template>

<script setup>
import { userStore } from "~/stores/UserStore";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import $toast from "~/utils/toast_notification";

const store = userStore();

let isPaymentUrlLoading = ref(false);

let ebookUrl = ref("");

let bookFormatType = ref("");

// props bookInfo
const props = defineProps({
  bookInfo: {
    type: Object,
    required: true,
  },
});

let isBookPurchased = ref(false);

onMounted(async () => {
  // check if user has already  purchased the book
  const isPurchased = await store.checkIfBookIsBought(props.bookInfo.id);

  isBookPurchased.value = isPurchased.bought;

  if (isBookPurchased.value) {
    const url = await getEbookUrl();
    ebookUrl.value = url;
  }
});

const buyEbook = async () => {
  try {
    console.log("buyEbook", props.bookInfo);

    const store = userStore();

    isPaymentUrlLoading.value = true;

    // generate order id

    // checkIfAddressIsAvailable
    const isAddressAvailable = await store.checkIfAddressIsAvailable();

    if (!isAddressAvailable) {
      // show toast asking to update address

      $toast.error("Address details are not updated", {
        timeout: 5000,
        position: "top-right",
      });

      // navigate to /user profile page
      setTimeout(() => {
        window.location.href = "/user";
      }, 2000);

      return;
    }

    const orderParams = {
      billing_name: store.userName,
      billing_email: store.userEmail,
      billing_tel: store.contactDetails.phoneNumber,
      billing_address: store.contactDetails.address,
      billing_city: store.contactDetails.city,
      billing_state: store.contactDetails.state,
      billing_zip: store.contactDetails.zipCode,
      billing_country: store.contactDetails.country,
      amount: props.bookInfo.ebookPrice,
      currency: "INR",
      language: "en",

      merchant_param1: props.bookInfo.id,
      merchant_param2: props.bookInfo.title,
      merchant_param3: "",
      merchant_param4: "",

      order_id: uuidv4(),
    };

    const runtimeConfig = useRuntimeConfig();

    const response = await store.invokeLambdaAPI(
      "POST",
      `/purchase/api/payments/initiatePayment`,
      orderParams
    );

    console.log("response", response);
    console.log("Payment initiated:", response.data);
    // get encryptedUrl from the response
    const paymentUrl = response.data.paymentUrl;

    console.log("paymentUrl", paymentUrl);
    // Redirect to the payment gateway
    window.location.href = paymentUrl;
    // open in new tab

    // window.open(paymentUrl, "_blank");
  } catch (error) {
    console.error("Error initiating payment:", error);
    // Handle error (e.g., show an error message to the user)
  } finally {
    isPaymentUrlLoading.value = false;
  }
};

const getEbookUrl = async () => {
  // make get call to /ebookUrl/${bookId}
  const response = await store.invokeLambdaAPI(
    "GET",
    `/ebookUrl/${props.bookInfo.id}`
  );

  // handle response {url:url}
  // check status code
  if (response.status === 200) {
    // if url contains .pdf then set bookFormatType to pdf , if .epub set to epub
    if (response.data.url.includes(".pdf")) {
      bookFormatType.value = "pdf";
    } else if (response.data.url.includes(".epub")) {
      bookFormatType.value = "epub";
    }
    return response.data.url;
  } else {
    // show error message
    console.log("error", response);
    $toast.error("Error fetching ebook url", {
      timeout: 5000,
      position: "top-right",
    });
  }
};
</script>
