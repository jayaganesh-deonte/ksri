<template>
  <div class="mx-4">
    <scholarsHeader />

    <div class="my-6 text-center">
      <section-title title="List of Foreign Scholars" />
      <div class="sectionBody" data-aos="fade-up">
        The Kuppuswami Sastri Research Institute provides ample opportunities
        for scholars who are interested in higher studies.
      </div>
      <div>
        <v-row class="my-6">
          <v-col
            v-for="(scholar, index) in foreignScholars"
            :key="scholar"
            cols="12"
            md="6"
          >
            <v-card
              class="ma-2 text-center foreignScholarCard"
              rounded="0"
              elevation="0"
              data-aos="fade-up"
            >
              <v-row align="center">
                <v-col cols="2" height="100%" class="ma-0 pa-0">
                  <v-card
                    elevation="0"
                    rounded="0"
                    color="#fafbfa"
                    height="100%"
                    class="ma-0 pa-0"
                  >
                    {{ index + 1 }}
                  </v-card>
                </v-col>
                <v-col cols="10">
                  <v-row class="text-start pa-1">
                    <v-col cols="12" md="5">
                      <div>
                        <div data-aos="fade-right">{{ scholar.name }}</div>

                        <div class="horizontalLine"></div>
                      </div>
                    </v-col>
                    <v-col data-aos="fade-left" cols="12" md="7">
                      <div class="d-flex align-center mb-2">
                        <v-icon size="x-small" class="mr-1">mdi-web</v-icon>
                        {{ scholar.university }}
                      </div>
                      <div class="d-flex align-center">
                        <v-icon size="x-small" class="mr-1">mdi-book</v-icon>
                        {{ scholar.subject }}
                      </div>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
            </v-card>
          </v-col>
        </v-row>
      </div>
    </div>
  </div>
</template>

<script setup>
useSeoMeta({
  title: "Foreign Scholars | KSR",
  description: "Foreign Scholars | KSR",
  ogTitle: "Foreign Scholars | KSR",
  ogDescription: "Foreign Scholars | KSR",
  twitterTitle: "Foreign Scholars | KSR",
  twitterDescription: "Foreign Scholars | KSR",
});

import scholarsHeader from "./scholarsHeader.vue";

const foreignscholarsData = await queryContent(
  "scholars_gateway",
  "foreignscholars"
).findOne();
const foreignScholars = foreignscholarsData.body;
</script>

<style scoped>
.foreignScholarCard {
  border: 1px solid #f0f5f0;
}
</style>
