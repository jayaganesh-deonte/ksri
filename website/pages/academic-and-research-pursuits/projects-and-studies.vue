<template>
  <div>
    <section-title title="KSRI PROJECTS & STUDIES" />

    <!-- add button list -->
    <div
      class="d-flex justify-center mx-2"
      :class="$device.isMobile ? 'flex-wrap' : 'flex-row'"
    >
      <div v-for="category in projectButtonList" :key="category">
        <v-btn
          color="primary"
          :variant="activeCategory === category ? 'flat' : 'outlined'"
          rounded="pill"
          class="ma-2"
          @click="activeCategory = category"
        >
          {{ category }}
        </v-btn>
      </div>
    </div>
    <div class="my-8 mx-6">
      <!-- display completed projects -->
      <div v-if="activeCategory === 'Completed'">
        <displayProjects :getEventsByCategory="getEventsByCategory" />
      </div>

      <!-- display ongoing projects -->
      <div v-if="activeCategory === 'On-Going'">
        <displayProjects :getEventsByCategory="getEventsByCategory" />
      </div>

      <!-- display future projects -->
      <div v-if="activeCategory === 'Future Projects'">
        <div
          v-for="(project, index) in getEventsByCategory"
          :key="project"
          data-aos="fade-up"
          :data-aos-delay="index * 100 + 500"
        >
          <v-card class="pa-4 ma-2" height="100%" rounded="0">
            <div
              class="text-center d-flex flex-column justify-center align-center"
            >
              <div class="text-h5 font-weight-bold">{{ project.title }}</div>
              <div class="horizontalLine my-6" style="--line-width: 10%"></div>
              <div class="text-subtitle-1">{{ project.description }}</div>
            </div>
          </v-card>
        </div>
      </div>

      <!-- display Ancient Indian Knowledge Series  -->
      <div v-if="activeCategory === 'Ancient Indian Knowledge Series'">
        <div
          v-for="(projects, category, index) in getEventsByCategory"
          :key="projects"
          data-aos="fade-up"
          :data-aos-delay="index * 100 + 500"
        >
          <v-card class="pa-4 ma-2" height="100%" rounded="0">
            <div
              class="text-secondary"
              data-aos="fade-right"
              :data-aos-delay="index * 100 + 500"
            >
              <v-icon>mdi-square-medium</v-icon>
              Ancient Indian Knowledge Series
            </div>
            <div
              class="text-h6 font-weight-bold"
              data-aos="fade-right"
              :data-aos-delay="index * 100 + 500"
            >
              {{ category }}
            </div>
            <div class="horizontalLine my-2" style="--line-width: 5%"></div>

            <!-- display projects with v-row v-col -->
            <v-row class="ma-2 pa-2">
              <v-col
                v-for="project in projects"
                :key="project"
                cols="12"
                sm="4"
                style="border: 1px solid #f0f5f0"
                data-aos="fade-up"
                :data-aos-delay="100"
              >
                <div class="text-body-1">
                  {{ project }}
                </div>
              </v-col>
            </v-row>
          </v-card>
        </div>
        <div class="d-flex align-center ma-2">
          <v-icon class="mr-2">mdi-information</v-icon>
          Those marked with *symbols have already been sponsored and these
          monographs would be published shortly.
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import displayProjects from "./displayProjects.vue";
const projects = {
  Completed: [
    {
      title: "PadukaSahasram( English and Tamil Trans.)",
      subTitle: "- Sri KesavaIyengar Endowment",
      completedYear: "2011-13",
    },
    {
      title: "Caturyuga Calendar of VaivasvataManvantara",
      subTitle: "- RamanandhaAdigalar Foundation",
      completedYear: "2007-09",
    },
    {
      title:
        "Preservation of the rare and ancient books through the Photolam system",
      completedYear: "2005-08",
    },
    {
      title: "Encyclopaedia of Numerals Vol.I",
      subTitle: "- B.Venkataramani Endowment",
      completedYear: "2005-06",
    },
    {
      title:
        "Digitisation of rare and ancient books of more than 100 years old by the TTD under the Millinium Book Project initiated by Dr.A.P.J.AbdulKalam President of India.",
      completedYear: "2004-05",
    },
    {
      title: "Cataloguing of the Library Books",
      subTitle: "- (being carried out)",
      completedYear: "2000-04",
    },
    {
      title: "Sadratnamala (An astro Mathematical text)",
      subTitle: "- Under INSA",
      completedYear: "1999",
    },
    {
      title: "Women in Epics",
      subTitle: "- A.C.Kamala Endowment for Women Studies",
      completedYear: "1997-99",
    },
    {
      title: "Women in Vedic Age",
      subTitle: "- A.C.Kamala Endowment for Women Studies",
      completedYear: "1996-2000",
    },
    {
      title: "Bhagavad Gita Bibliography",
      subTitle: "- SuryakumariDwarakadas Endowment - (Vol. I & II)",
      completedYear: "1994-96",
    },
    {
      title: "Kudiyattam:Preliminaries& Performance",
      subTitle: "- A.C.Rangarajan Endowment",
      completedYear: "1992-94",
    },
    {
      title: "Kudiyattam tradition-Womens Role in Kudiyattam",
      subTitle: "- A.C.Rangarajan Endowment",
      completedYear: "1990-92",
    },
    {
      title: "Sabda Brahman",
      subTitle: "- A.C.Rangarajan Endowment",
      completedYear: "1990-91",
    },
    {
      title: "Sanskrit Translation of Tamil works - Muthollayiram",
      subTitle: "- Govt. of India",
      completedYear: "1990-91",
    },
    {
      title: "Eclipses in Hindu Life & Thought",
      subTitle: "- Sponsored by Dr.G. SrinivasamurthiFoundation",
      completedYear: "1989-90",
    },
    {
      title: "Kriyakramadyotika",
      subTitle: "- Indira Gandhi National Centre for the Arts - (In print)",
      completedYear: "1989",
    },
    {
      title: "KV Sarma",
      subTitle: "- INSA",
      completedYear: "1986-87",
    },
    {
      title: "Tala Project by Dr. Robert E Brown",
      subTitle: "- Under Smithsonian Institution Grant",
      completedYear: "1986-87",
    },
    {
      title: "A Manual on Grantha Script",
      completedYear: "1985-86",
    },
    {
      title: "Saiva Agama KosaKalanidhi, Kalakosa",
      subTitle:
        "- Govt. of India Indira Gandhi National Centre for the Arts (Published)",
      completedYear: "1984",
    },
    {
      title:
        "Weather Science in Ancient India Critical study of the BrhatSamhita.",
      subTitle: "- Under INSA(Published)",
      completedYear: "1983-86",
    },
  ],
  "On-Going": [
    {
      title: "Vaishnava Agamas",
      subTitle:
        "- These are ancient original Sanskrit texts which give valuable information about temple architecture, rituals, installation of various deities, Yogic practices etc.",
    },
    {
      title: "Cataloguing of Palm-Leaf Manuscripts",
      subTitle:
        "- The KSRI has a well-maintained collection of hundreds of ancient palm-leaf and papers manuscript.",
    },
    {
      title: "Evolution of Earth in Puranas",
      subTitle:
        "- Puranas devote quite a sizeable portion of the texts for the description of earth and its evolution (sarga-pratisharga).",
    },
    {
      title: "Svarodaya Science of Yoga",
      subTitle:
        "- The present project would help in knowing more about this forgotten branch of Yoga.",
    },
    {
      title: "Encyclopaedia of Numerals Vol II ( Vol. I has been published )",
      subTitle: "- B.VenkataramaniEndowment",
    },
    {
      title: "Vicara Sagaram Brahmasri Anna",
      subTitle: "- Subramanian Endowment",
    },
    {
      title: "Encyclopaedia of Yoga",
      subTitle: "-",
    },
    {
      title: "Dictionary of Geographical terms from Sanskrit Sources",
      subTitle: "- B.MadhavanEndowment",
    },
    {
      title: "Monograph on Ancient Indian Mathematics",
      subTitle: "- Canara Bank Project",
    },
    {
      title: "English Translation of Sisupalavadha",
      subTitle: "- Dr.S.S.JanakiEndowment",
    },
    {
      title: "Critical Edition of HathasanketaChandrika of Sundara Deva",
      subTitle: "- D.P Santanam - Indic Academy Endowment",
    },
    {
      title: "English Translation of Kiratarjuniyta",
      subTitle: "- Dr E R Rama Bai Chair",
    },
    {
      title: "English Translation of Krishi Parashara - Agricultural",
      subTitle: "",
    },
    {
      title: "English Translation of Kasyapa Silpasastra",
      subTitle: "",
    },
  ],
  "Future Projects": [
    {
      title: "Svarodaya Science of Yoga",
      description:
        "Yoga is one of the greatest contributions of India to the world. There are many branches of Yoga such as Karma, Jnana, Bhakti, Hatha, Laya, Mantra, and Kundalini. Svarodaya science of Yoga is very useful for the health of human being and also in predicting one's future. It is based on breathing pattern of each individual. Not many texts are available on this ancient science. The present project would help in knowing more about this forgotten branch of Yoga.",
    },
    {
      title: "Evolution of Earth in Puranas",
      description:
        "Puranas devote quite a sizeable portion of the texts for the description of earth and its evolution (sarga-pratisharga). Usually the technique adopted in giving even difficult concepts is by means of a story, symbolic representation or allegorical stories. The present project envisages to bring out such ancient knowledge on evolution of earth, climate changes, changes in earth surface due to passage of time, the concept of deluge (pralaya) etc. with the help of recently known scientific facts. An attempt will also be made to reconstruct the geological history of earth and divide it into geological ages based on Puranic information.",
    },
    {
      title: "Cataloguing of Palm-Leaf Manuscripts",
      description:
        "The KSRI has a well-maintained collection of hundreds of ancient palm-leaf and papers manuscript. However, for want of resources we have not been able to prepare a Descriptive Catalogue and also digitize the manuscripts. Once this is done and hosted on the web-site, scholars from across the globe can have easy access to them. The manuscripts are in different scripts like Grantha, Devanagari, Tigalari, Malayalam and Tamil. Some of them are of historical value too. We need at least one scholar well versed in deciphering the scripts and prepare a Descriptive Catalogue.",
    },
    {
      title: "Architecture and Vastu",
      description:
        "India's contribution to the field of architecture is unmatched. There are thousands of historical monuments / palaces/ temples which have withstood various challenges, both man-made and natural phenomena for hundreds of years. Mnasra is an ancient text, more than 1000 years old that treats architecture in various aspects.",
    },
    {
      title: "Vaishnava Agamas",
      description:
        "These are ancient original Sanskrit texts which give valuable information about temple architecture, rituals, installation of various deities, Yogic practices etc. These are still followed in many temples in India. The Institute possesses rare hand written copies of these two agama texts, each 300 pages long, with scribal errors which may have to be edited.",
    },
    {
      title: "Research papers presented in Seminars and Conferences",
      description:
        "The Institute has been organizing many seminars / conferences on various important themes of historical and practical value. The papers presented by leading scholars in these fields would be published in one volume which would be a source of useful information to scholars on religion, especially Vaishnavism.",
    },
    {
      title: "Yoga Upanishads",
      description: `There are 20 minor Upanishads dealing on various precepts and practices of Yoga. They have been collected and published as "Yoga Upanishads' by the Adyar Library Research Centre more than fifty years ago and separate translation in English has also been published. However there are many errors in the original texts and subsequently in the translation as well. KSRI published three such Yoga Upanishads with correct "readings' in original Sanskrit with Roman transliteration, English translation, and Notes. We would like to publish the rest of seventeen texts.`,
    },
    {
      title: "Buddhism",
      description: `The institute has published many articles on various aspects of theory and practice of Buddhism in its Journal of Oriental Research from its inception.Some of them would be collected and presented as a separate book 'Some aspects of Buddhist Studies" by the Institute.`,
    },
    {
      title: "Jainism",
      description: `The book Saddarsanasamuccaya of Jinabhadrasuri has been prescribed as text in some Indian universities for the post-graduate degree in philosophy/Sanskrit. Unfortunately no English translation is available for this book. The Institute comes forward to help the students and scholars, especially in the field of Jainology by bringing out a readable English translation for this work.`,
    },
    {
      title: "Viracarita of Anantakavi",
      description:
        "This is a Mahakavya which throws much light on the empire of Vikramaditya and Salivahanaera.This is being critically edited for the first time",
    },
  ],
  "Ancient Indian Knowledge Series": {
    Science: [
      "1 Mathematics*",
      "2 Arithmetic",
      "3 Astronomy",
      "4 Algebra",
      "5 Geometry",
      "6 Trigonometry",
      "7 Astrology",
      "8 Physics",
      "9 Chemistry",
      "10 Zoology",
      "11 Ornithology",
      "12 Botany*",
      "13 Flowers and Fruits",
      "14 Medicine",
      "15 Surgical Instruments*",
      "16 Embryology/Genetics",
      "17 Pediatrics",
      "18 Physiology/Anatomy",
      "19 Psychology",
      "20 Alchemy",
      "21 Metallurgy",
      "22 Mechanical Contrivances",
      "23 Gemmology",
      "24 Environmental Studies",
      "25 Water Divining",
      "26 War Science",
      "27 Geography",
      "28 Geology",
      "29 Oceanography*",
      "30 Medicinal Plants",
      "31 Agriculture",
      "32 Horticulture",
      "33 Cartography",
      "34 Dietetics",
      "35 Planets and Stars*",
    ],
    "Art and Architecture": [
      "1 Dance",
      "2 Music*",
      "3 Architecture",
      "4 Vastu",
      "5 Iconography",
      "6 Temple Architecture",
      "7 Town Planning*",
      "8 Sculpture",
      "9 Painting/colouring/dyeing",
      "10 Sports and Games",
      "11 Boxing and Wrestling",
      "12 Aeronautics",
      "13 Ship Building",
      "14 Culinary",
    ],
    "Social Studies": [
      "1 Women Studies",
      "2 Life of Brahmacharins",
      "3 Life of Grihasthas",
      "4 Life of Vanaprasthas",
      "5 Life of Sannyasins",
      "6 Law of Inheritance",
      "7 Management Studies",
      "8 Education",
      "9 Law and Jurisprudence",
      "10 Transportation",
      "11 Communication",
      "12 Water Management",
      "13 Rivers",
      "14 Trade and Commerce",
      "15 Taxation",
      "16 Irrigation",
      "17 Costumes and Jewellery",
      "18 Economics",
      "19 Politics",
      "20 Rituals and Sacrifices",
      "21 Festivals*",
      "22 Gods and goddesses",
      "23 Labourers and Craftsmen",
      "24 Sanskrit Institutions in India",
    ],
    Literature: [
      "1 Vedic Literature*",
      "2 Minor Upanishads",
      "3 Epics*",
      "4 Puranas",
      "5 Smrti/Dharmasastra",
      "6 Kavya (Poetry)",
      "7 Prose",
      "8 Campu",
      "9 Drama",
      "10 Alankara",
      "11 Lexicography",
      "12 Grammar*",
      "13 Riddles/Brain Teasers*",
      "14 Modern Literature",
      "15 Darsana (Philosophy)",
      "16 Nastika ( Heterodox) Schools",
      "17 Mimamsa",
      "18 Nyaya-Vaisesika",
      "19 Sankhya-Yoga",
      "20 Vedanta",
      "21 Buddhism",
      "22 Jainism",
      "23 Agama (Saiva, Sakta and Vaishnava)",
      "24 Stotra Literature",
      "25 Bhakti Literature",
      "26 Manuscriptology",
      "27 Epigraphy",
    ],
  },
};

let activeCategory = ref("Completed");

const projectButtonList = [
  "Completed",
  "On-Going",
  "Ancient Indian Knowledge Series",
  "Future Projects",
];

const getEventsByCategory = computed(() => {
  return projects[activeCategory.value];
});
</script>
