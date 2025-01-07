<template>
  <div v-if="!fetchedNews">
    <v-progress-circular color="primary" indeterminate></v-progress-circular>
  </div>
  <div v-else>
    <div v-if="newsNotFound">
      <div class="ma-8 text-center">
        <div class="text-h4 text-secondary defaultFont" data-aos="fade-right">
          News Not Found
        </div>
      </div>
      <div class="ma-8 text-center">
        <v-btn color="primary" variant="outlined" to="/news/">
          Back to News
        </v-btn>
      </div>
    </div>
    <div v-else>
      <div class="ma-8 text-center">
        <div class="my-8">
          <section-title title="KSRI News Update" />
          <div class="sectionSubtitle2 text-black mb-8">
            KSRI is an enabler of research for Indian and foreign scholars in
            their Doctorate pursuits.
          </div>
        </div>

        <v-card
          elevation="0"
          rounded="0"
          class="ma-4 mx-auto pa-4"
          :width="`${$device.isMobile ? '90vw' : '80vw'}`"
        >
          <!-- heading -->
          <div class="text-h4 text-secondary defaultFont" data-aos="fade-right">
            {{ news.heading }}
          </div>
          <v-img
            :src="getImageUrl(news.avatarImage[0])"
            v-if="news.avatarImage[0]"
            width="100%"
            height="500"
            fit
            class="ma-2"
          ></v-img>

          <!-- text -->
          <div class="text-h6 my-4 defaultFont text-left" data-aos="fade-left">
            <div v-html="news.text"></div>
          </div>

          <v-divider class="my-4"></v-divider>
          <!-- images -->
          <div class="text-body-1 defaultFont d-flex flex-wrap">
            <v-img
              v-for="(image, index) in news.images"
              :key="index"
              :src="getImageUrl(image)"
              width="250"
              height="250"
              class="ma-2"
              fit
              data-aos="fade-up"
              :data-aos-delay="index * 10"
            ></v-img>
          </div>
        </v-card>

        <!-- display next and previous btns -->
        <div class="ma-8 text-center">
          <v-btn
            color="primary"
            variant="outlined"
            rounded="pill"
            v-if="displayPreviousButton"
            :to="`/news/${previousNewsId}`"
            class="mx-4"
          >
            Previous
          </v-btn>

          <v-btn
            color="primary"
            variant="outlined"
            rounded="pill"
            v-if="displayNextButton"
            class="mx-4"
            :to="`/news/${nextNewsId}`"
          >
            Next
          </v-btn>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { newsStore } from "~/stores/newsStore";

const storeNews = await newsStore();

const props = defineProps({
  news: {
    type: Object,
    required: true,
  },
});

const route = useRoute();

console.log(route.params.id);

const fetchedNews = ref(false);
const newsNotFound = ref(false);

const news = reactive({});

let displayNextButton = ref(false);
let displayPreviousButton = ref(false);

let nextNewsId = ref("");
let previousNewsId = ref("");

const getImageUrl = (url) => {
  const runtimeConfig = useRuntimeConfig();
  return runtimeConfig.public.ASSET_DOMAIN + url;
};

const fetchPagination = async () => {};

const fetchNews = async () => {
  try {
    console.log("fetching news", route.params.id);

    const response = await storeNews.getNewsById(route.params.id);

    console.log(response);

    Object.assign(news, response);
    fetchedNews.value = true;

    useSeoMeta({
      title: news.heading,
      description: news.text,
      ogTitle: news.heading,
      ogDescription: news.text,
      twitterTitle: news.heading,
      twitterDescription: news.text,
      ogImage: news.avatarImage?.[0]
        ? getImageUrl(news.avatarImage[0])
        : undefined,
      twitterImage: news.avatarImage?.[0]
        ? getImageUrl(news.avatarImage[0])
        : undefined,
    });
  } catch (error) {
    console.error(error);
    newsNotFound.value = true;
  }
};
await fetchNews();

const pagination = storeNews.getNewsPagination(route.params.id);

displayNextButton.value = pagination.displayNextButton;
displayPreviousButton.value = pagination.displayPreviousButton;

nextNewsId.value = pagination.nextNewsId;
previousNewsId.value = pagination.previousNewsId;
</script>
