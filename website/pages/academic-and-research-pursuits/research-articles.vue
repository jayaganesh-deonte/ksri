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
                :href="article.link"
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
const researchArticles = [
  {
    title: "MINING AND METALLURGY",
    subTitle:
      "A survey of Sanskrit literature would bring out the fact that the mining and metallurgical sciences were part of the social life in ancient India.",
    author:
      "Dr. K.S. Balasubramanian, Deputy Director, K.S.R.I. Institute, Chennai",
    link: "https://d30y75l38k1y9.cloudfront.net/upload/media/1 Mining and Metallurgy.pdf",
  },
  {
    title: "ÄSTHÄNAKOLÄKALAM — A MATHEMATICAL TREATISE IN TAMIL",
    subTitle:
      "The mathematical text in Tamil by the name Ästhänakoläkalam seems to be a compilation of Manuscripts. Some of the interesting topics from this text are taken into consideration here.",
    author:
      "Dr. Sita Sundar Ram, Senior Research Fellow, K.S.R.Institute, Chennai",
    link: "https://d30y75l38k1y9.cloudfront.net/upload/media/Asthanakolakalam.pdf",
  },
  {
    title: "BHAYÄNAKA AND BÉBHATSA",
    subTitle:
      "Bharata considers these two Rasas as powerful enough to be called as major Rasas, since they are attuned with Véra and Raudra respectively",
    author: "Ms. Annapurna, Research Associate, K. S. R. Institute, Chennai",
    link: "https://d30y75l38k1y9.cloudfront.net/upload/media/Bhayanaka and Bibhatsa.pdf",
  },
  {
    title: "KÄVYAS ON VÄGGEYAKÄRAS",
    subTitle:
      "It is in Sanskrit literature that the art, the science and the history of Indian music are mainly embedded and a knowledge of Sanskrit and a study of the texts in that language becomes essential for every person pursuing Indian music.",
    author: "Lavanya Pravin, Research Scholar, K. S. R. Institute, Chennai",
    link: "https://d30y75l38k1y9.cloudfront.net/upload/media/Kavyas on Vageyakaras.pdf",
  },
  {
    title: "Temple Festival- Vajramakuta Utsava of Melkote",
    subTitle:
      "A couple of Puranic concepts relating to the birth of Närada and the story related to Mainäka mountain is taken up in this paper to be analysed on the lines of the modern geographic concepts known as Kuiper belt and Oort clouds.",
    author:
      "Dr. V. Yamuna Devi, Asst. Professor, Kuppuswami Sastri Research Institute, Chennai",
    link: "https://d30y75l38k1y9.cloudfront.net/upload/media/Temple Festival - Vajramakuta Utsava - Melkote - Copy.pdf",
  },
  {
    title: "KUIPER BELT, OORT CLOUD – A PURANIC INSIGHT",
    subTitle: "This paper gives a Geographical approach to Indology",
    author: "K. Vidyuta, Ph. D. Research Scholar, K. S. R. Institute, Chennai",
    link: "https://d30y75l38k1y9.cloudfront.net/upload/media/Technical - Kuiper Belt, Oort Clouds - Puranic insight.pdf",
  },
  {
    title: "THE GEOGRAPHICAL APPROACH TO INDOLOGY",
    subTitle: "This paper gives a Geographical approach to Indology",
    author: "R. Parthasarthy, Honorary Professor, KSRI, Chennai",
    link: "https://d30y75l38k1y9.cloudfront.net/upload/media/The Geographical Approach to Indology - Copy.pdf",
  },
];
</script>
