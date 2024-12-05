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
          <div class="sectionSubtitle2">
            KSRI is an enabler of research for Indian and foreign scholars in
            their Doctorate pursuits.
          </div>
        </div>
        <!-- heading image -->
        <v-img
          :src="news.avatarImage"
          v-if="news.avatarImage"
          width="100%"
          height="500"
          fit
          class="ma-2"
        ></v-img>
        <!-- heading -->
        <div class="text-h4 text-secondary defaultFont" data-aos="fade-right">
          {{ news.heading }}
        </div>

        <!-- text -->
        <div class="text-h6 my-4 defaultFont" data-aos="fade-left">
          {{ news.text }}
        </div>

        <v-divider class="my-4"></v-divider>
        <!-- images -->
        <div class="text-body-1 defaultFont d-flex flex-wrap">
          <v-img
            v-for="(image, index) in news.images"
            :key="index"
            :src="image"
            width="250"
            height="250"
            class="ma-2"
            fit
            data-aos="fade-up"
            :data-aos-delay="index * 100"
          ></v-img>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { newsStore } from "~/stores/newsStore";

const storeNews = newsStore();

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

const fetchNews = async () => {
  try {
    console.log("fetching news", route.params.id);

    const response = await storeNews.getNewsById(route.params.id);

    console.log(response);

    Object.assign(news, response);
    fetchedNews.value = true;
  } catch (error) {
    console.error(error);
    newsNotFound.value = true;
  }
};
await fetchNews();
</script>
