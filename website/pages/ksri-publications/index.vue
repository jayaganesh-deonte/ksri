<template>
  <div>
    <div>
      <section-title title="KSRI PUBLICATIONS" />
      <div class="sectionSubtitle2ForPublications">
        As a premier Institution in the field of research, KSRI has involved
        itself actively in the pursuit of excellence in its field of
        specialisation. In order to remain competitive and abreast of the
        requirement of Scholars, it is essential that the enhancement of
        Knowledge and Professional Expertise are maintained at a sufficiently
        higher level.
      </div>
    </div>

    <DisclaimerForBooks class="mx-8" />
    <div class="text-center my-8">
      <!-- display recent books in horizontal line -->
      <div class="sectionTitle3">BOOKS/MONOGRAPHS</div>
      <v-row class="ma-2" justify="center">
        <v-col v-for="book in recentBooks" :key="book.title" cols="10" md="3">
          <book-card :book="book" />
        </v-col>
        <!-- a col to show "View All" -->
        <v-col cols="10" md="1">
          <nuxt-link to="/ksri-publications/books">
            <v-card
              color="primary"
              height="100%"
              class="d-flex flex-column align-center justify-center font-weight-bold"
            >
              <div>View All</div>
            </v-card>
          </nuxt-link>
        </v-col>
      </v-row>
    </div>

    <div class="text-center my-8">
      <!-- display recent Journals in horizontal line -->
      <div class="sectionTitle3">JOURNAL OF ORIENTAL RESEARCH</div>
      <v-row class="ma-2" justify="center">
        <v-col
          v-for="book in recentJournals"
          :key="book.title"
          cols="10"
          md="3"
        >
          <book-card :book="book" :is-book="false" />
        </v-col>
        <!-- a col to show "View All" -->
        <v-col cols="10" md="1">
          <nuxt-link to="/ksri-publications/journals">
            <v-card
              color="primary"
              height="100%"
              class="d-flex flex-column align-center justify-center font-weight-bold"
            >
              <div>View All</div>
            </v-card>
          </nuxt-link>
        </v-col>
      </v-row>
    </div>

    <div
      v-for="additionalPublication in additionalPublications"
      :key="additionalPublication"
    >
      <div class="text-center my-8">
        <!-- display recent Journals in horizontal line -->
        <div class="sectionTitle3">
          Also Available ({{ additionalPublication }})
        </div>
        <v-row class="ma-2" justify="center">
          <v-col
            v-for="book in recentAdditionalPublicationBooks[
              additionalPublication
            ]"
            :key="book.title"
            cols="10"
            md="3"
          >
            <book-card :book="book" :is-book="true" />
          </v-col>
          <!-- a col to show "View All" -->
          <v-col cols="10" md="1">
            <nuxt-link
              :to="
                '/ksri-publications/additionalPublications/' +
                additionalPublication
              "
            >
              <v-card
                color="primary"
                height="100%"
                class="d-flex flex-column align-center justify-center font-weight-bold"
              >
                <div>View All</div>
              </v-card>
            </nuxt-link>
          </v-col>
        </v-row>
      </div>
    </div>

    <!-- <div class="text-center my-4">
      <div class="text-h6">
        A Committee is constituted to help the Institute in identifying the
        texts to be published and also in other matters related to the research
        work of the Institute. At present the following scholars are the
        members.
      </div>
    </div>
    <div>
      <div v-for="key in publicationCommitteeKeys" class="ma-6" :key="key">
        <div
          class="sectionTitle3 my-2"
          data-aos="zoom-in"
          data-aos-duration="1000"
          data-aos-delay="400"
        >
          {{ key }}
        </div>
        <CommitteeMembers
          :governingBodyMembers="committee"
          :governingBodyMembersKey="key"
        />
      </div>
    </div> -->

    <!-- <div class="text-center ma-6">
      <div class="sectionSubtitle" data-aos="fade-up">Overview</div>
      <div class="text-h6" data-aos="fade-up">
        As a premier Institution in the field of research, KSRI has involved
        itself actively in the pursuit of excellence in its field of
        specialisation. In order to remain competitive and abreast of the
        requirement of Scholars, it is essential that the enhancement of
        Knowledge and Professional Expertise are maintained at a sufficiently
        higher level.
      </div>
    </div> -->
    <div>
      <v-card class="ma-4 pa-6" rounded="0" data-aos="fade-up">
        <div class="d-flex flex-column align-center justify-center">
          <div class="text-h5" data-aos="fade-right">
            Milestones in KSRI Publication
          </div>
          <div class="horizontalLine my-3" style="--line-width: 10%"></div>
        </div>
        <div data-aos="fade-left" class="text-left">
          Publications of the Institute have received wide acclaim and
          appreciation from scholars all over the world and have been reviewed
          in the National Dailies like "The Hindu", Academic Journals and other
          magazines in India and Abroad.
        </div>
        <div class="text-left ml-8">
          • KSRI takes pride in announcing the publication of the most ancient
          Tamil text on grammar "Tolkappiyam" with Roman transliteration and
          English translation.
        </div>
        <div class="text-left ml-8">
          • "Artha Sastra" of Kautilya, acclaimed as the best source of
          information on ancient Indian Polity and Economics was published for
          the first time with two lesser known commentaries.
        </div>
        <div class="text-left ml-8">
          • Publication of "Lectures on Patanjali's Mahabhashya" by
          Dr.P.S.Subrahmanya Sastri and "A critical study on Bija Pallava", a
          16th Century Text on Algebra have received appreciation from around
          the world.
        </div>
        <div class="text-left ml-8">
          • As a mark of the 75th year Anniversary Celebrations of the KSRI, 12
          monographs covering varied topics under Indian Knowledge Series were
          published and released.
        </div>
        <div class="mt-8">
          To name a few - Ancient Indian Surgical Instruments, Primer to Ancient
          Indian Botany, Town planning in Ancient India, Vadavagni- Submarine
          fire: Geographical perspective, Evolution of Earth etc.
        </div>
        <div class="">
          These publications pave the way for sharing of knowledge and
          information, assimilation of ideas and expertise for preservation and
          upkeep of archives.
        </div>
      </v-card>
    </div>

    <!-- <div class="my-6">
     

      <publicationForSale
        :publicationsForSale="publicationsForSale"
        title="Publications for Sale"
      />

      <publicationForSale
        :publicationsForSale="publicationsOutOfStock"
        title="Publications Out of Stock"
      />
    </div> -->

    <!-- Samskrita Academy Publications -->
    <!-- <div class="my-6">
      <v-card rounded="0" class="ma-4 pa-6">
        <div class="d-flex flex-column align-center">
          <div class="text-h5" data-aos="fade-right">
            Samskrita Academy Publications
          </div>
          <div class="horizontalLine my-3" style="--line-width: 10%"></div>
        </div>
        <div
          v-for="samskritaAcademyPublication in samskritaAcademyPublications"
          :key="samskritaAcademyPublication.name"
          class=""
        >
          <v-list-item data-aos="fade-up" class="ma-2">
            <template v-slot:prepend>
              <v-icon>mdi-book-open-blank-variant-outline</v-icon>
            </template>

            <div>
              <v-row class="">
                <v-col cols="12" md="10">
                  <div>
                    {{ samskritaAcademyPublication.title }}
                  </div>
                </v-col>
                <v-col cols="12" md="2">
                  <div>{{ samskritaAcademyPublication.price }}</div>
                </v-col>
              </v-row>
            </div>
          </v-list-item>
          <div class="horizontalLine" style="--line-height: 1px"></div>
        </div>
      </v-card>
    </div> -->
  </div>
</template>

<script setup>
const description =
  "KSRI has been publishing the Journal of Oriental Research periodically from its inception till date and it is internationally well known.";
useSeoMeta({
  title: "KSRI Publications",
  description: description,
  ogTitle: "KSRI Publications",
  ogDescription: description,
  twitterTitle: "KSRI Publications",
  twitterDescription: description,
});

import publicationForSale from "../academic-and-research-pursuits/components/publicationForSale.vue";
const publicationCommittee = await queryContent(
  "publications",
  "committeemembers"
).findOne();

// [
//   {
//     "id": "01JFAHR8VXRAR7Q0CB18CQY1SD",
//     "name": "Dr.P.C.Muralidharan",
//     "designation": "Editorial Committee",
//     "metadata": {
//       "updated_by": "admin",
//       "created_at": "2024-12-17T14:53:31.389Z",
//       "updated_at": "2024-12-17T14:53:31.389Z",
//       "created_by": "admin"
//     }
//   }
// ]

const publicationCommitteeKeys = ["Research Committee", "Editorial Committee"];

let committee = {};
let researchCommitee = [];
let editorialCommittee = [];

console.log("publicationCommittee", publicationCommittee);

publicationCommittee.body.forEach((member) => {
  if (publicationCommitteeKeys.includes(member.designation)) {
    committee[member.designation] = member;
  }
  if (member.designation === "Research Committee") {
    researchCommitee.push(member);
  }
  if (member.designation === "Editorial Committee") {
    editorialCommittee.push(member);
  }
});

committee = {
  "Research Committee": researchCommitee,
  "Editorial Committee": editorialCommittee,
};

console.log("committee", committee);

const publicationCards = [
  // {
  //   title: "The Journal of Oriental Research",
  //   description:
  //     "Initiated by Professor S. Kuppuswami Sastri in 1927, the 'Journal of Oriental Research' is a reputed internationally acclaimed magazine covering various aspects involved in Sanskrit and Indological studies. The publication of this magazine was entrusted to the Institute from 1944. 91 Volumes of the journal have been published so far. The Journal, admittedly reputed for original research and scientific investigation, carries general, critical and research articles on diverse indological subjects. Some rare texts, critically edited and appear serially as supplementary to the original volumes later get published as independent books.",
  // },
  // {
  //   title: "Books/Monographs/Reprints",
  //   description:
  //     "Books and Monographs are being published periodically as an endeavour to promote Sanskrit and Indological Studies. They cover a wide range of subjects which include Vedic Studies, Yoga, Literature, Language, Grammar, Philosophy, Religion, Mathematics, Astronomy, Astrology, Medical Science, Ayurveda, Arthasastra, Purva Mimamsa, Advaita, Nyaya, Vaishnavism, Saivism, Arts, Science, etc. Around 100 Books and Monographs including critical editions of hitherto unpublished manuscripts on different aspects of Sanskrit and Indology have also been published so far.",
  // },
  // {
  //   title: "Milestones in KSRI Publication",
  //   description: `Publications of the Institute have received wide acclaim and appreciation from scholars all over the world and have been reviewed in the National Dailies like "The Hindu", Academic Journals and other magazines in India and Abroad. KSRI takes pride in announcing the publication of the most ancient Tamil text on grammar "Tolkappiyam" with Roman transliteration and English translation. "Artha Sastra" of Kautilya, acclaimed as the best source of information on ancient Indian Polity and Economics was published for the first time with two lesser known commentaries. Publication of "Lectures on Patanjali's Mahabhashya" by Dr.P.S.Subrahmanya Sastri and "A critical study on Bija Pallava", a 16th Century Text on Algebra have received appreciation from around the world. It had been conducting Seminars, Conferences and Workshops which pave the way for sharing of knowledge and information, assimilation of ideas and expertise for preservation and upkeep of archives.`,
  // },
];

// const publicationsForSaleData = await queryContent(
//   "publications",
//   "forsale"
// ).findOne();

// const publicationsForSale = publicationsForSaleData.body;

// const publicationsOutOfStockData = await queryContent(
//   "publications",
//   "outofstock"
// ).findOne();

// const publicationsOutOfStock = publicationsOutOfStockData.body;

// Samskrita Academy Publications
// const samskritaAcademyPublicationsData = await queryContent(
//   "publications",
//   "samskritaacademypublications"
// ).findOne();

// const samskritaAcademyPublications = samskritaAcademyPublicationsData.body;
let booksData = await queryContent("publications", "books").findOne();

let ksriBooks = booksData.body;

ksriBooks = ksriBooks.sort((a, b) => {
  const yearA = a.yearOfPublication.trim();
  const yearB = b.yearOfPublication.trim();
  if (yearA && yearB) {
    return yearA < yearB ? 1 : -1;
  } else if (yearA) {
    return -1;
  } else if (yearB) {
    return 1;
  } else {
    return 0;
  }
});

const journalsData = await queryContent("publications", "journals").findOne();

let ksriJournals = journalsData.body;

ksriJournals.sort((a, b) => {
  // Handle empty or missing yearOfPublication
  if (!a.yearOfPublication) return 1;
  if (!b.yearOfPublication) return -1;

  // Compare dates using Date object comparison
  const dateA = new Date(a.yearOfPublication);
  const dateB = new Date(b.yearOfPublication);

  // Compare timestamps to sort from newest to oldest
  return dateB.getTime() - dateA.getTime();
});

// recent 3 books
const recentBooks = reactive(ksriBooks.slice(0, 3));

// recent 3 journals
const recentJournals = reactive(ksriJournals.slice(0, 3));

// get all additionalpublications
const additionalPublicationsData = await queryContent(
  "publications",
  "additionalpublications"
).findOne();
const additionalPublications = additionalPublicationsData.body;

let additionalPublicationBooks = {};

// for additionalPublications query content
for (const element of additionalPublications) {
  const additionalPublication = element;

  const publicationNameForFile =
    additionalPublication.replace(/[^a-zA-Z0-9]/g, "").toLowerCase() +
    "journals";

  // query content
  const additionalPublicationJournalsData = await queryContent(
    "publications",
    publicationNameForFile
  ).findOne();

  // books
  const publicationNameForBooks = additionalPublication
    .replace(/[^a-zA-Z0-9]/g, "")
    .toLowerCase();

  // query content
  const additionalPublicationBooksData = await queryContent(
    "publications",
    publicationNameForBooks
  ).findOne();

  additionalPublicationBooks[additionalPublication] = [
    ...additionalPublicationJournalsData.body,
    ...additionalPublicationBooksData.body,
  ];

  // sort additionalPublicationBooks by year
  additionalPublicationBooks[additionalPublication].sort((a, b) => {
    // Handle empty or missing yearOfPublication
    if (!a.yearOfPublication) return 1;
    if (!b.yearOfPublication) return -1;

    // Compare dates using Date object comparison
    const dateA = new Date(a.yearOfPublication);
    const dateB = new Date(b.yearOfPublication);

    // Compare timestamps to sort from newest to oldest
    return dateB.getTime() - dateA.getTime();
  });
}

// recent 3 books for all additional publications
const recentAdditionalPublicationBooks = {};
for (const key in additionalPublicationBooks) {
  recentAdditionalPublicationBooks[key] = additionalPublicationBooks[key].slice(
    0,
    3
  );
}
</script>
