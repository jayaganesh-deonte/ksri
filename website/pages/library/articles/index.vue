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
const description =
  "The uniqueness of the Institute's library is that it preserves the precious personal collections of great savants such as Dr.S.Radhakrishnan, Prof. Hiriyanna, Dr.V.Raghavan and others which are hardly available elsewhere.";

useSeoMeta({
  title: "Articles",
  description,
  ogTitle: "Articles",
  ogDescription: description,
  twitterTitle: "Articles",
  twitterDescription: description,
});

import LibraryHeader from "../LibraryHeader.vue";

let searchText = ref("");

const articlesData = await queryContent("library", "articles").findOne();
const articles = articlesData.body;

const articleHeaders = [
  {
    text: "Title",
    value: "title",
  },
  { text: "Author", value: "author", sortable: false },
  { text: "Journal", value: "journal", sortable: false },
  { text: "Volume #", value: "volume", sortable: false },
  { text: "Year", value: "year", sortable: false },
  { text: "Remarks", value: "remarks", sortable: false },
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
