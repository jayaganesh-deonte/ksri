<template>
  <v-card elevation="0" rounded="0" color="transparent">
    <div class="mx-4">
      <SectionTitle title="Mm. PROF. KUPPUSWAMI SASTRI" />
      <SectionSubtitle
        subTitle="Mahamahopadhyaya, Darsana Kalanidhi,Vidyavacaspati Professor Kuppuswami
      Sastri (1880-1943)"
      ></SectionSubtitle>
      <v-row class="mt-12">
        <v-col cols="12" sm="12" md="1"> </v-col>
        <v-col
          cols="12"
          sm="12"
          md="2"
          data-aos="fade-right"
          data-aos-delay="500"
        >
          <v-img src="/img/founder.png" fit height="250" width="250"> </v-img>
        </v-col>
        <v-col
          cols="12"
          sm="12"
          md="8"
          data-aos="fade-left"
          data-aos-delay="500"
        >
          <div class="text-h5 font-weight-bold mb-8">Introduction</div>
          <div class="text-h6">
            Mm. Prof. S. Kuppuswami Sastri was a Sanskrit Scholar of repute in
            India during his time and had devoted his life time to study of
            Sanskrit and Indology. He was a Professor, Editor and Author in
            Sanskrit Language and of Sanskrit heritage in other languages. He
            was a well-known literary figure of yesteryears in India and abroad
            after India. KSRI was established in 1945 as a fitting tribute to
            him and his contributions to Sanskrit heritage and related Indology.
          </div>
        </v-col>
        <v-col cols="12" sm="12" md="1"> </v-col>
      </v-row>
      <v-card
        elevation="0"
        rounded="0"
        color="greenBg"
        class="pa-4 my-6 text-h6"
        data-aos="fade-up"
        data-aos-delay="500"
      >
        <div>
          Hailing from a great family of saintly scholars, Professor Sastri had
          mastered Vedanta, Nyaya, Mimamsa, Vyakarana and Sahitya even before he
          was twenty years (20) of age. He combined an all round traditional
          scholarship both in Sastra and Sahitya with modern scholarship. He
          contributed largely in many ways to the cause of Sanskrit learning,
          education and research. A pioneering scholar in Purva Mimamsa, he
          became the first Principal of the Madras Sanskrit College, the premier
          college in India that teaches Purva Mimamsa. He had earned the great
          respect of not only all the traditional and modern researchers but
          also great statesmen scholars like Rt. Hon'ble V.S.Srinivasa Sastri,
          Dr. S. Radhakrishnan, Prof. M. Hiriyanna and others.
        </div>
      </v-card>

      <v-container>
        <div class="sectionTitle2" data-aos="fade-up" data-aos-delay="500">
          Mm. Prof. S. Kuppuswami Sastri - Career Details
        </div>
        <div class="d-flex flex-column justify-start align-center">
          <v-card
            v-for="(item, index) in careerDetails"
            :key="index"
            class="d-flex justify-start align-center pa-2 text-start text-h6 ma-2"
            elevation="0"
            color="white"
            min-height="100"
            data-aos="fade-up"
            :data-aos-delay="index * 100 + 500"
            :width="$device.isMobile ? '' : '40vw'"
          >
            <div
              class="d-flex"
              :class="`${$device.isMobile ? ' flex-column ' : 'flex-row'}`"
            >
              <div
                class="d-flex justify-center align-center"
                data-aos="fade-right"
                :data-aos-delay="index * 100 + 500"
              >
                <v-btn color="secondary" size="large" variant="flat">
                  {{ item.year }}
                </v-btn>
              </div>
              <div
                class="d-flex flex-column justify-space-between mx-2"
                data-aos="fade-left"
                :data-aos-delay="index * 100 + 500"
              >
                <div>{{ item.description }}</div>
                <v-divider
                  thickness="3"
                  width="100"
                  color="primary"
                ></v-divider>
              </div>
            </div>
          </v-card>
        </div>
      </v-container>

      <v-container>
        <div
          class="text-h6 font-weight-bold text-secondary text-center"
          data-aos="fade-up"
          data-aos-delay="500"
        >
          Fashioned the Sanskrit Honours Syllabus, the Siromani course of study
          on the traditional lines and the oriental titles in the University of
          Madras.
        </div>

        <div
          class="heading-with-line text-h4 font-weight-bold text-primary text-center"
          data-aos="fade-up"
          data-aos-delay="600"
        >
          Started
        </div>

        <div class="d-flex flex-wrap justify-center">
          <v-card
            v-for="(item, index) in startedInfo"
            :key="index"
            class="d-flex flex-column justify-space-around align-center pa-2 text-h6 ma-2"
            elevation="0"
            color="white"
            width="250"
            height="200"
            data-aos="fade-up-right"
            :data-aos-delay="index * 200 + 500"
          >
            <v-row>
              <v-col cols="12" sm="12" md="12" class="d-flex justify-center">
                <v-btn
                  color="secondary"
                  size="large"
                  variant="flat"
                  width="100"
                  >{{ item.year }}</v-btn
                >
              </v-col>
              <v-col cols="12" sm="12" md="12">
                <div
                  class="d-flex flex-column justify-space-between text-center align-center"
                >
                  <div>{{ item.description }}</div>
                  <v-divider
                    thickness="3"
                    width="100"
                    color="primary"
                  ></v-divider>
                </div>
              </v-col>
            </v-row>
          </v-card>
        </div>
      </v-container>

      <v-container>
        <div
          class="text-h6 text-center"
          data-aos="fade-up"
          data-aos-delay="100"
        >
          Delivered series of lectures and continually wrote articles in
          Research journals.
        </div>
      </v-container>
      <v-divider />

      <EditedAuthoredCard
        title="Edited"
        :editedInfo="editedInfo"
        cardColor="primary"
      />
      <v-divider />
      <EditedAuthoredCard
        title="Authored"
        :editedInfo="authored"
        cardColor="secondary"
      />
      <div class="text-h6 text-center" data-aos="fade-up" data-aos-delay="500">
        Presided over sections in the All India Oriental Conferences, Indian
        Philosophical Congress, Kanchipuram Parishads, and the Advaita Sabha of
        South India.
      </div>
    </div>
  </v-card>
</template>

<script setup>
const description =
  "Mm. Prof. S. Kuppuswami Sastri was a Sanskrit Scholar of repute in India during his time and had devoted his life time to study of Sanskrit and Indology. He was a Professor, Editor and Author in Sanskrit Language and of Sanskrit heritage in other languages. He was a well know literary figure of yesteryears in India and abroad after India. KSRI was established in 1945 as a fitting tribute to him and his contributions to Sanskrit heritage and related Indology.";
useSeoMeta({
  title: "Kuppuswami Sastri Profile",
  description: description,
  ogTitle: "Kuppuswami Sastri Profile",
  ogDescription: description,
  twitterTitle: "Kuppuswami Sastri Profile",
  twitterDescription: description,
});

import EditedAuthoredCard from "./EditedAuthoredCard.vue";

const careerDetails = [
  {
    year: "1936-40",
    description:
      "Honorary Professor of Sanskrit at the Annamalai University, Annamalainagar.",
  },
  {
    year: "1914-36",
    description:
      "Professor of Sanskrit and Comparative Philology at the Presidency College, Madras; Curator of Madras Govt. Oriental Mss. Library, Madras",
  },
  {
    year: "1910-14",
    description:
      "Principal of the Raja's College of Sanskrit and Tamil Studies, Thiruvaiyaru.",
  },
  {
    year: "1906-10",
    description:
      "Principal of the Madras Sanskrit College, Mylapore; Chairman of the Board of Examiners in Sanskrit in the Madras University.",
  },
];

const startedInfo = [
  {
    year: "1927",
    description: "The Samskrita Academy",
  },
  {
    year: "1927",
    description: "Journal of Oriental Research",
  },
  {
    year: "1926-27",
    description: "The Oriental Research Institute at the University of Madras",
  },
];

const editedInfo = [
  "Dhvanyaloka with Locana, Kaumudi and his own Upalocana, Udyota I",
  "Brahmasiddhi",
  "Vibhrama Viveka of Mandana Misra",
  "Vinavasavadatta",
  "66 volumes of Descriptive and Triennial Catalogues of the Manuscripts at the Madras Government Oriental Manuscripts Library.",
];

const authored = [
  "Primer of Indian Logic",
  "Highways and Byways of Literary Criticism in Sanskrit",
  "Compromises in the History of Advaitic Thought.",
];
</script>
