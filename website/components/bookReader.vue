<template>
  <div>
    <div v-if="!store.isAuthenticated">
      <!-- login to buy book -->
      <div class="my-4">
        <v-btn
          rounded="pill"
          variant="flat"
          color="secondary"
          @click="loginToBuy"
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
          :isEncrypted="true"
        />

        <PdfViewer
          :pdfUrl="ebookUrl"
          v-if="bookFormatType == 'pdf' && ebookUrl != ''"
          buttonText="Read Book"
          :bookId="bookInfo.id"
          :isEncrypted="true"
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
import { onBeforeUnmount, watch } from "vue";

const store = userStore();

let isPaymentUrlLoading = ref(false);
let ebookUrl = ref("");
let bookFormatType = ref("");
let refreshInterval = ref(null);

// props bookInfo
const props = defineProps({
  bookInfo: {
    type: Object,
    required: true,
  },
});

let isBookPurchased = ref(false);

const loginToBuy = async () => {
  // save current route to local storage
  localStorage.setItem("redirect", window.location.pathname);

  // navigate to /login
  navigateTo("/login");
};

// Function to get the eBook URL
const getEbookUrl = async () => {
  try {
    const response = await store.invokeLambdaAPI(
      "GET",
      `/ebookUrl/${props.bookInfo.id}`
    );

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
      // show error message silently
      console.log("Error fetching ebook URL:", response);
    }
  } catch (error) {
    console.error("Error fetching ebook URL:", error);
  }
  return "";
};

// Setup URL refresh mechanism
const setupUrlRefresh = () => {
  // Clear any existing interval first
  clearInterval(refreshInterval.value);

  // Refresh URL every 4.5 minutes (270000ms)
  // Using 4.5 minutes instead of 5 to ensure we refresh before expiration
  refreshInterval.value = setInterval(async () => {
    if (isBookPurchased.value) {
      console.log("Refreshing eBook URL");
      const url = await getEbookUrl();
      if (url) {
        ebookUrl.value = url;
      }
    }
  }, 270000);
};

// Watch for visibility changes
const handleVisibilityChange = () => {
  if (document.visibilityState === "visible") {
    // Page is visible, setup refresh and get URL immediately
    if (isBookPurchased.value) {
      setupUrlRefresh();
      // Also refresh URL immediately when returning to the page
      getEbookUrl().then((url) => {
        if (url) ebookUrl.value = url;
      });
    }
  } else {
    // Page is hidden, clear interval to save resources
    clearInterval(refreshInterval.value);
  }
};

onMounted(async () => {
  // Check if user has already purchased the book
  const isPurchased = await store.checkIfBookIsBought(props.bookInfo.id);
  isBookPurchased.value = isPurchased.bought;

  if (isBookPurchased.value) {
    const url = await getEbookUrl();
    ebookUrl.value = url;

    // Set up URL refresh mechanism
    setupUrlRefresh();

    // Add visibility change listener
    document.addEventListener("visibilitychange", handleVisibilityChange);
  }
});

// Watch for changes in isBookPurchased
watch(isBookPurchased, (newValue) => {
  if (newValue) {
    getEbookUrl().then((url) => {
      if (url) ebookUrl.value = url;
    });
    setupUrlRefresh();
  } else {
    clearInterval(refreshInterval.value);
  }
});

// Clean up when component is unmounted
onBeforeUnmount(() => {
  clearInterval(refreshInterval.value);
  document.removeEventListener("visibilitychange", handleVisibilityChange);
});

const buyEbook = async () => {
  try {
    console.log("buyEbook", props.bookInfo);

    const store = userStore();

    isPaymentUrlLoading.value = true;

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
  } catch (error) {
    console.error("Error initiating payment:", error);
    // Handle error (e.g., show an error message to the user)
  } finally {
    isPaymentUrlLoading.value = false;
  }
};
</script>
