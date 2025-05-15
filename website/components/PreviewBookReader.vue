<template>
  <div>
    <div v-if="ebookUrl != ''">
      <Epubreader
        :src="ebookUrl"
        v-if="bookFormatType == 'epub' && ebookUrl != ''"
        buttonText="Preview Book"
        buttonColor="primary"
        :bookId="bookInfo.id"
        :displayBookMark="false"
      />

      <PdfViewer
        :pdfUrl="ebookUrl"
        v-if="bookFormatType == 'pdf' && ebookUrl != ''"
        buttonText="Preview Book"
        buttonColor="primary"
        :bookId="bookInfo.id"
        :displayBookMark="false"
      />
    </div>
    <div v-else>
      <!-- progress  -->
      <v-btn color="primary" rounded="pill">
        <v-progress-circular
          class="text-center"
          indeterminate
          color="primary"
        ></v-progress-circular>
      </v-btn>
    </div>
  </div>
</template>

<script setup>
import { userStore } from "~/stores/UserStore";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import $toast from "~/utils/toast_notification";

const store = userStore();

let ebookUrl = ref("");

let bookFormatType = ref("");

// props bookInfo
const props = defineProps({
  bookInfo: {
    type: Object,
    required: true,
  },
});

onMounted(() => {
  getEbookUrl();
});

const getEbookUrl = () => {
  // make get call to /ebookUrl/${bookId}
  const runtimeConfig = useRuntimeConfig();

  const ASSET_DOMAIN = runtimeConfig.public.ASSET_DOMAIN;

  const fileUrl = ASSET_DOMAIN + props.bookInfo.previewEbookUrl;

  if (fileUrl.includes(".pdf")) {
    bookFormatType.value = "pdf";
  } else if (fileUrl.includes(".epub")) {
    bookFormatType.value = "epub";
  }
  ebookUrl.value = fileUrl;
};
</script>
