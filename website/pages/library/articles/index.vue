<template>
  <div>
    <LibraryHeader active-button-name="KSRI Articles" />
    <!-- create vuetify data table with books data -->
    <v-card flat data-aos="fade-up">
      <template v-slot:text>
        <v-text-field
          v-model="searchText"
          label="Enter a keyword to search..."
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          hide-details
          single-line
        ></v-text-field>
      </template>

      <v-data-table
        class="custom-table"
        :items="articles"
        :search="searchText"
        :items-per-page-options="[
          { value: 100, title: '100' },
          { value: 250, title: '250' },
          { value: 500, title: '500' },
          { value: -1, title: '$vuetify.dataFooter.itemsPerPageAll' },
        ]"
        :items-per-page="100"
      >
      </v-data-table>
    </v-card>
  </div>
</template>

<script setup>
import LibraryHeader from "../LibraryHeader.vue";

let searchText = ref("");

const articles = [
  {
    Title: "Analytic Tendency in Tamil",
    Author: "Varadarajan, M.",
    Jounal: "Annals of Oriental Research",
    "Volume #": "XIII",
    Year: 1957,
    Remarks: "-",
  },
  {
    Title: "Annual Report",
    Author: "-",
    Jounal: "Asiatic Society",
    "Volume #": "XVIII",
    Year: 1996,
    Remarks: "Year Book of the Asiatic Society for 1992-93",
  },
  {
    Title: "Beyond Philosophy: A Thought Experiment in Ontic Subjectivity",
    Author: "Bruening W.J.",
    Jounal: "Indian Philosophical Quarterly",
    "Volume #": "Vol 10 no 3",
    Year: 1983,
    Remarks: "-",
  },
  {
    Title: "Ceramic Production Techniques",
    Author: "Vasant Shinde And Prabodh Shirvalkar",
    Jounal: "Deccan College Research Institute",
    "Volume #": "Vol 68-69",
    Year: "2008-2009",
    Remarks: "-",
  },
  {
    Title: "Componetial Analysis of Nepali Verbs of Movement",
    Author: "Shanti Basnyat",
    Jounal: "Deccan College Research Institute",
    "Volume #": "Vol 46",
    Year: 1987,
    Remarks: "-",
  },
  {
    Title:
      "Hari-Hara Sculpture from Shahabad District, Bihar and a Hari-Hara Sculpture from Golaghat District",
    Author: "Hemendranath Dutta",
    Jounal: "Kala",
    "Volume #": 13,
    Year: "-",
    Remarks: "-",
  },
  {
    Title: "Indian Archaeology At Crossroads - The Future Of Our Past",
    Author: "Dhavalikar M . K .",
    Jounal: "Deccan College Research Institute",
    "Volume #": 44,
    Year: 1985,
    Remarks: "-",
  },
  {
    Title: "Indra's Proteges in the Mahabharata's Mythology of the Great Rsis",
    Author: "Peter Hill",
    Jounal: "Annals of the Bhandarkar Oriental Research Institute",
    "Volume #": "Vol LXXV",
    Year: 1994,
    Remarks: "-",
  },
  {
    Title: "Interpretation of a passage From The Mrcchakatika",
    Author: "Mirashi V.V.",
    Jounal: "Journal of The Maharaja Sayajirao University of Baroda",
    "Volume #": "Vol 14 no 3-4",
    Year: 1965,
    Remarks: "-",
  },
  {
    Title: "Janesque Painting - Reassessment",
    Author: "Kalyan Krishna and Shailendra Kumar",
    Jounal: "Kala",
    "Volume #": 14,
    Year: "-",
    Remarks: "-",
  },
  {
    Title:
      "Ksemarajakatha Quoted in Sivarama's Vimarsini Commentary on Harsa's Nagananda & Ksemendra's Brhatkathamanjari",
    Author: "Herman Tieken",
    Jounal: "Annals of the Bhandarkar Oriental Research Institute",
    "Volume #": "LXXVII - Parts I to IV",
    Year: 1996,
    Remarks: "-",
  },
  {
    Title: "New Commentary-- Gunavati and Act V of the Prabodhacandrodaya",
    Author: "Nrisinha Prasad Bhaduri",
    Jounal: "Asiatic Society",
    "Volume #": "XXVIII - No. 1",
    Year: "-",
    Remarks: "-",
  },
  {
    Title: "Nirvana Prakarana",
    Author: "Narayanaswami Aiyar .K",
    Jounal: "Adyar Library Bulletin",
    "Volume #": "Vol 35 parts 1-2",
    Year: 1971,
    Remarks: "-",
  },
  {
    Title: "Note on the Gaurangacandrodaya",
    Author: "Manabendu Banerji",
    Jounal: "Asiatic Society",
    "Volume #": "XXVII - No. 4",
    Year: "-",
    Remarks: "-",
  },
  {
    Title: "Omnipotence",
    Author: "Bimal Krishna matilal",
    Jounal:
      "Our Hertiage Bulletin of The Departmental of Postagraduate Training and Research sanskrit College , calcutta",
    "Volume #": "Vol 28 Part 1",
    Year: 1980,
    Remarks: "-",
  },
  {
    Title: "Ramayana scenes in Orissan sculptural art",
    Author: "Nanda Kishor Swain",
    Jounal: "Kala",
    "Volume #": 17,
    Year: "-",
    Remarks: "-",
  },
  {
    Title:
      "Some Observations On The Holocene Geomorphic History Of Nandi River , Maharashtra",
    Author: "Kale V . S . and Rajaguru S . N .",
    Jounal: "Deccan College Research Institute",
    "Volume #": 43,
    Year: 1984,
    Remarks: "-",
  },
];

const articleHeaders = [
  {
    text: "Title",
    value: "Title",
  },
  { text: "Author", value: "Author", sortable: false },
  { text: "Journal", value: "Jounal", sortable: false },
  { text: "Volume #", value: "Volume #", sortable: false },
  { text: "Year", value: "Year", sortable: false },
  { text: "Remarks", value: "Remarks", sortable: false },
];
</script>

<style>
/*style table header and add bg color to alternate rows*/

/*thead {
  background-color: #ebeeeb;
  color: #0a160f;
  font-weight: bold !important;
  font-size: 16px;
}*/

.v-table thead tr th {
  background-color: #ebeeeb !important;
  color: #0a160f !important;
  font-weight: bold !important;
  font-size: 16px !important;
}

.v-table tbody tr:nth-child(even) {
  background-color: #ebeeeb !important;
}

.v-table tbody tr:nth-child(odd) {
  background-color: white !important;
}
</style>
