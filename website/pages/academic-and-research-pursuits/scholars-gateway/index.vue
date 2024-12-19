<template>
  <div class="mx-4">
    <scholarsHeader />

    <div class="my-4 pa-4">
      <section-title title="TRADITIONAL SCHOLARS" />
      <div class="sectionSubtitle" data-aos="fade-right" data-aos-delay="500">
        Indian Scholars - Traditional Study
      </div>
      <div class="text-center" data-aos="fade-up" data-aos-delay="600">
        In the past traditional scholars of great merit were given junior/senior
        research scholarships by the Govt. of India through the Central Sanskrit
        Board/Rashtriya Sanskrit Sansthan. Scholars under this scheme produced
        valuable texts, Sastra texts/topics, Literature, Agama texts,
        Dramaturgical texts etc. Diverse categories of research - traditional,
        modern, inter-disciplinary etc. by Indian and foreign scholars, were
        officially started from 1983 within the campus as regular academic work.
        Besides there was an all round improvement in other academic activities.
        Special mention has to be made about the efforts taken by the Institute
        in the field of Saiva and Vaishnava Agamic Studies. No other institution
        in South India except the concerned departments in the University of
        Madras has taken up these studies.
      </div>

      <v-row class="ma-2">
        <v-col
          cols="12"
          md="4"
          v-for="(scholar, index) in traditionalScholars"
          :key="scholar"
          class="d-flex flex-wrap pa-2"
          data-aos="fade-up"
          :data-aos-delay="index * 100"
        >
          <v-card
            width="100%"
            height="100%"
            elevation="0"
            rounded="0"
            class="ma-2 d-flex flex-column justify-space-between"
          >
            <div
              class="text-h6 text-secondary font-weight-bold"
              data-aos="fade-right"
              :data-aos-delay="index * 100"
            >
              {{ scholar.name }}
            </div>
            <div
              class="text-primary ml-2"
              data-aos="fade-right"
              :data-aos-delay="index * 100"
            >
              {{ scholar.year }} {{ scholar.description }}
            </div>
            <div class="horizontalLine"></div>
          </v-card>
        </v-col>
      </v-row>
    </div>

    <div>
      <v-row>
        <v-col data-aos="fade-right">
          <v-card class="pa-4 ma-2">
            <div class="text-h6" data-aos="fade-up">
              <v-icon color="accentGreen">mdi-information</v-icon>

              Scholars have obtained Vidyavaridhi (equivalent to Ph.D.),
              affiliated to the Rashtriya Sanskrit Sansthan, New Delhi.
            </div>

            <v-divider
              thickness="3"
              color="accentGreen"
              class="my-6"
            ></v-divider>

            <div class="sectionTitle3 text-start">
              Vidyavaridhi (Ph.D, New Delhi) (1983-1995)
            </div>

            <!-- display Vidyavaridhis-->
            <v-row class="ma-2">
              <v-col
                cols="12"
                md="6"
                v-for="(scholar, index) in vidyavaridhis"
                :key="scholar"
                class="d-flex flex-wrap pa-2"
                data-aos="fade-up"
                :data-aos-delay="index * 100"
              >
                <v-card
                  width="100%"
                  height="100%"
                  elevation="0"
                  rounded="0"
                  class="ma-2 d-flex flex-column justify-space-between"
                >
                  <div class="text-h6 text-secondary font-weight-bold">
                    {{ scholar.name }}
                  </div>
                  <div class="text-primary ml-2">
                    {{ scholar.year }} {{ scholar.description }}
                  </div>
                  <div class="horizontalLine"></div>
                </v-card>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
        <v-col data-aos="fade-left">
          <v-card class="pa-4 ma-2">
            <div class="text-h6" data-aos="fade-up">
              <v-icon color="accentGreen">mdi-information</v-icon>

              Scholars were awarded Shastrachudamani for undertaking research in
              various topics.
            </div>

            <v-divider
              thickness="3"
              color="accentGreen"
              class="my-6"
            ></v-divider>

            <div class="sectionTitle3 text-start">
              Shastrachudamani (New Delhi) (1983-1995)
            </div>

            <!-- display shastrachudamanis-->
            <v-row class="ma-2">
              <v-col
                cols="12"
                md="6"
                v-for="(scholar, index) in shastrachudamanis"
                :key="scholar"
                class="d-flex flex-wrap pa-2"
                data-aos="fade-up"
                :data-aos-delay="index * 100"
              >
                <v-card
                  width="100%"
                  height="100%"
                  elevation="0"
                  rounded="0"
                  class="ma-2 d-flex flex-column justify-space-between"
                >
                  <div class="text-h6 text-secondary font-weight-bold">
                    {{ scholar.name }}
                  </div>
                  <div class="text-primary ml-2">
                    {{ scholar.year }} {{ scholar.description }}
                  </div>
                  <div class="horizontalLine"></div>
                </v-card>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script setup>
const description =
  "In the past traditional scholars of great merit were given junior/senior research scholarships by the Govt. of India through the Central Sanskrit Board/Rashtriya Sanskrit Sansthan. Scholars under this scheme produced valuable texts, Sastra texts/topics, Literature, Agama texts, Dramaturgical texts etc. Diverse categories of research - traditional, modern, inter-disciplinary etc. by Indian and foreign scholars, were officially started from 1983 within the campus as regular academic work. Besides there was an all round improvement in other academic activities. Special mention has to be made about the efforts taken by the Institute in the field of Saiva and Vaishnava Agamic Studies. No other institution in South India except the concerned departments in the University of Madras has taken up these studies.";

useSeoMeta({
  title: "TRADITIONAL SCHOLARS | Scholars Gateway",
  description: description,
  ogTitle: "TRADITIONAL SCHOLARS | Scholars Gateway",
  ogDescription: description,
  twitterTitle: "TRADITIONAL SCHOLARS | Scholars Gateway",
  twitterDescription: description,
});

import SectionTitle from "~/components/SectionTitle.vue";
import scholarsHeader from "./scholarsHeader.vue";

const traditionalData = await queryContent(
  "scholars_gateway",
  "traditionalscholars"
).findOne();

const traditionalScholars = traditionalData.body;

const vidyavaridhisData = await queryContent(
  "scholars_gateway",
  "vidyavaridhis"
).findOne();

const vidyavaridhis = vidyavaridhisData.body;

const shastrachudamanisData = await queryContent(
  "scholars_gateway",
  "shastrachudamanis"
).findOne();

const shastrachudamanis = shastrachudamanisData.body;
</script>
