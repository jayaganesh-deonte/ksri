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
import SectionTitle from "~/components/SectionTitle.vue";
import scholarsHeader from "./scholarsHeader.vue";

const traditionalScholars = [
  {
    name: "Sri V. Srivatsankachariar",
    year: "1975-78",
    description: "Haradatta's Padmamanjari",
  },
  {
    name: "Sri P.N. Krishnamachari",
    year: "1972-75",
    description: "Vedic Authority for the Divya Prabandhas",
  },
  {
    name: "Sri V. Kutumba Sastri",
    year: "1972-75",
    description:
      "A Critical Edition and Study of Dharmasuri's Sahityaratnakara",
  },
  {
    name: "Sri T.S. Ramanujachari",
    year: "1969-75",
    description: "A Pancaratra Agama work in Mss.",
  },
  {
    name: "Sri V. Krishnamachar",
    year: "1969-75",
    description: "Contribution of Dvaita School to Kavya Literatur",
  },
  {
    name: "Sri V. Hayagrivachar",
    year: "1969-72",
    description: "Bhattasangraha of Raghavendrayati",
  },
  {
    name: "Sri S. Srinivasan",
    year: "1969-72",
    description: "Sanskrit words in Tamil Literature",
  },
  {
    name: "Sri Navalapakkam Varadachari",
    year: "1966-68",
    description: "Critical Study of Vedanta Desika's Sarvartha Siddhi",
  },
  {
    name: "Kumari Premavathi",
    year: "1965-69",
    description: "Agastya Pandita's Krsna-Carita",
  },
  {
    name: "Sri S. Arayar Rama Sharma",
    year: "1965-69",
    description: "Critical edn. & study of Vishnu Dharma",
  },
  {
    name: "Sri N.A. Yajnavarshan",
    year: "1965-69",
    description: "Taittiriya Samhita - Ritual Aspect",
  },
  {
    name: "Sri Agnihotram Ramanuja Tatachariar",
    year: "1965-68",
    description: "Sudarsana Suri",
  },
  {
    name: "Sri K.V. Seshadrinathan",
    year: "1964-66",
    description:
      "Dharabandha's comm. Sudha on Citra Mimamsa of Appaya Diksita.",
  },
  {
    name: "Sri K. Srinivasachariar",
    year: "1964-66",
    description: "Sanskrit teaching methods",
  },
  {
    name: "Sri A. R. Krishnamachariar",
    year: "1964-66",
    description:
      "Tarkaparibhasaparipati - Technical Terminology of Indian Logic",
  },
  {
    name: "Sri E.J. Kumaraswami Dikshitar",
    year: "1964-66",
    description: "Kanva Satapatha Brahmana text edn.",
  },
  {
    name: "Sri D. Srinivasachariar",
    year: "1964-66",
    description: "An account in Sanskrit of Vedanta Desika's Tamil works",
  },
  {
    name: "Sri K.V. Seshadrinathan",
    year: "1960-62",
    description: "Mahanatakasuktisudhanidhi - Critical edn. & study",
  },
  {
    name: "Sri D. Srinivasachariar",
    year: "1960-62",
    description: "Sri Srirama Desikan",
  },
  {
    name: "Sri Srirama Desikan",
    year: "1960-62",
  },
  {
    name: "Sri Agnihotram Ramanuja Tatachariar",
    year: "1960-62",
    description: "Democratic institutions in Rigveda",
  },
];

const vidyavaridhis = [
  {
    name: "K.S.Balasubramanian",
    description: "Critical study of Hathasanketacandrika of Sundaradeva",
  },
  {
    name: "T.V.Vasudeva",
    description:
      "Critical Edition and Study from manuscripts of Amarananda's Svatmayogapradipa",
  },
  {
    name: "Smt.K.Gomati",
    description:
      "Critical Edition of Ananda Tirtha's Dvadasa Stotra with hitherto unpublished commentaries.",
  },
  {
    name: "Sri S Bilvanathan",
    description:
      "Critical Edition & Study from Mss. of Vidhibhusana by Venkatanarayana",
  },
  {
    name: "Sri Neelabalan",
    description:
      "Critical Edition & Study of Tantranitilahari of Ramanujadasa from Mss.",
  },
  {
    name: "Sri K. Sreekanthan",
    description: "Duruhasiksa of Appayya Diksita-III- A Critical Study",
  },
  {
    name: "Smt G.D. Jayalakshmi",
    description: "Critical Edition & Study of Darukavanavilasa by Ratnaradhya",
  },
  {
    name: "Ms. T.Lalitha Subhalakshmi",
    description: "Critical Edition & Study of Alankarasirobhusana",
  },
  {
    name: "Sri K Ramanathan",
    description: "Critical Edition & Study of Advaitamukasara",
  },
  {
    name: "Ms. S. Annapurna",
    description: "Critical Edition & Study of Dhanyakumaracarita",
  },
  {
    name: "Sri D. Mallikarjuna",
    description: "Mimamsa Yajnika Sampradaya Samiksha",
  },
  {
    name: "Sri V. Soumya Narayanan",
    description: "Sri Vaishnavasampradaye Sritattvavicarah",
  },
  {
    name: "Sri R.Natarajan",
    description:
      "Nalladhvarinah Advaitarasamanjari Parimalavyakhya Sahita samskaranam Visishtadhyayanam ca",
  },
  {
    name: "Dr.T. Sanjeeva Rao",
    description:
      "Bharatiya Samskriteh ve raghavasya samskrita gaveshana mulaka upakritih",
  },
  {
    name: "Smt. Prabha",
    description: "Lasyangas",
  },
  {
    name: "Sri T.S. Nagarajan",
    description: "Jyotishe Ayurdayam",
  },
  {
    name: "Sri Bhavanarayanan",
    description: "Sahitya",
  },
  {
    name: "Sri J. Venkataraman",
    description: "Sambhubhattasya Nirupanam",
  },
  {
    name: "Sri K.N. Varadarajan",
    description: "Saint-poets in Sanskrit from 12th to 19th C.A.D",
  },
  {
    name: "Sri H.G. Panduranga",
    description: "Critical Edition & Study of Madrakanya Parinaya Campus",
  },
];

const shastrachudamanis = [
  {
    name: "Dr.A. Thiruvengadathan",
    description:
      "Edition from Manuscripts of Suktisadhutvamalika of Viraraghava",
  },
  {
    name: "Dr.V.L.Sethuraman",
    description: "Edition and Study of Dattatreya Campu",
  },
  {
    name: "Dr.C.Panduranga Bhatta",
    description: "Critical Study of Arunagiri's Com. on Kalidasa's Raghuvamsa",
  },
  {
    name: "Sri N.S. Sathagopan",
    description:
      "Critical Edition and Study of Life of Vaishnavacarya Sri Ramanuja Mahadesikan",
  },
  {
    name: "Dr. R.Thyagarajan",
    description: "Edition from Mss. of Cidambarakavi's Bhagavata Campu",
  },
  {
    name: "Sri Goda Venkateswara Rao",
    description:
      "Edition from Mss. of Tryambaka Sastri's Hetvabhasa Samanyanirukti",
  },
  {
    name: "Pt.L. Narayanan",
    description: "Some Mimamsa concepts in Sastradipika",
  },
  {
    name: "Sri Bilvanathan",
    description: "Origin and Development of Apurvavidhi in Mimamsa",
  },
  {
    name: "Sri N. Neelabalan",
    description: "Contribution of Ramanujadasa to Mimamsa Sastra",
  },
  {
    name: "Dr. R.N. Sampath",
    description: "Critical analysis of citations in Vedanta Desikas Works",
  },
  {
    name: "Sri K.A. Sabharatnam Sivacarya",
    description: "Pancasuddhi in Saiva Agamas",
  },
];
</script>
