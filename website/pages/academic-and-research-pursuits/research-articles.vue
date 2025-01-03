<template>
  <div class="">
    <div class="ma-6 pa-6">
      <section-title title="RESEARCH ARTICLES" />
      <div class="sectionSubtitle2" data-aos="fade-up">
        The Scholars of KSRI have been actively participating in various
        Conferences, Seminars and workshops by presenting Reasearch papers on
        Indology. They are also contributing Research articles to Various
        Journals on different topics of Indic Knowledge systems. Some of them
        are -
      </div>
    </div>

    <v-card color="greenBg" rounded="0" elevation="0">
      <div>
        <v-card
          v-for="article in researchArticles"
          class="ma-6 pa-4"
          :key="article"
          rounded="0"
          data-aos="fade-up"
          :data-aos-delay="`${researchArticles.indexOf(article) * 100}`"
        >
          <v-row align="center">
            <v-col
              cols="12"
              md="10"
              data-aos="fade-right"
              :data-aos-delay="`${researchArticles.indexOf(article) * 100}`"
            >
              <div class="text-body-1">
                {{ article.subTitle }}
              </div>
              <div class="text-h5 font-weight-bold text-secondary">
                {{ article.title }}
              </div>

              <div class="text-h6">
                {{ article.author }}
              </div>
            </v-col>
            <v-col
              cols="12"
              md="2"
              data-aos="fade-left"
              :data-aos-delay="`${researchArticles.indexOf(article) * 100}`"
            >
              <v-btn
                color="primary"
                variant="outlined"
                rounded="pill"
                :href="getImageUrl(article.link)"
                target="_blank"
                rel="noopener noreferrer"
              >
                Download
              </v-btn>
            </v-col>
          </v-row>
        </v-card>
      </div>
    </v-card>
  </div>
</template>

<script setup>
const description =
  "The Scholars of KSRI have been actively participating in various Conferences, Seminars and workshops by presenting Reasearch papers on Indology. They are also contributing Research articles to Various Journals on different topics of Indic Knowledge systems. Some of them are -";

useSeoMeta({
  title: "Research Articles | KSRI",
  description: description,
  ogTitle: "Research Articles | KSRI",
  ogDescription: description,
  twitterTitle: "Research Articles | KSRI",
  twitterDescription: description,
});

const researchArticlesData = await queryContent("researcharticles").findOne();

const researchArticles = researchArticlesData.body;

const getImageUrl = (url) => {
  const runtimeConfig = useRuntimeConfig();
  return runtimeConfig.public.ASSET_DOMAIN + url;
};
</script>
