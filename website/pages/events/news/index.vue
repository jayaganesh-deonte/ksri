<template>
  <div class="text-center mx-4">
    <section-title title="KSRI News Update" />
    <!-- <div class="text-h6" data-aos="fade-up-right" data-aos-delay="500">
      KSRI is an enabler of research for Indian and foreign scholars in their
      Doctorate pursuits.
    </div> -->

    <div>
      <v-row>
        <v-col
          v-for="(item, index) in storeNews.news"
          :key="index"
          cols="12"
          sm="12"
          md="4"
          class="ma-0"
        >
          <NewsCard :item="item" :index="index" />
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script setup>
useSeoMeta({
  title: "KSRI News",
  description: "KSRI News",
  ogTitle: "KSRI News",
  ogDescription: "KSRI News",
  twitterTitle: "KSRI News",
  twitterDescription: "KSRI News",
});

import NewsCard from "~/components/news/NewsCard.vue";

import { newsStore } from "~/stores/newsStore";

const storeNews = await newsStore();

const data = await queryContent("news").findOne();

// sort data by date
storeNews.news.sort((a, b) => {
  return new Date(b.date) - new Date(a.date);
});
</script>
