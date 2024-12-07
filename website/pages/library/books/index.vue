<template>
  <div>
    <LibraryHeader active-button-name="KSRI Books" />

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
        :headers="headers"
        :items="books"
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

const booksData = await queryContent("library", "books").findOne();

const books = booksData.body;

const booksTableHeader = [
  {
    title: "Accession No",
    key: "Accession No",
  },
  {
    title: "Book Title",
    key: "Book Title",
  },
  {
    title: "Author",
    key: "Author",
  },
  {
    title: "Editor",
    key: "Editor",
  },
  {
    title: "Publisher",
    key: "Publisher",
  },
  {
    title: "Remarks",
    key: "Remarks",
  },
];

let searchText = ref("");
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
