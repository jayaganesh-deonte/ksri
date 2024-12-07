<template>
  <div>
    <LibraryHeader active-button-name="KSRI Journals" />

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
        :expanded="expanded"
        show-expand
        class="custom-table"
        :headers="journalHeaders"
        :items="journals"
        :search="searchText"
        :items-per-page-options="[
          { value: 100, title: '100' },
          { value: 250, title: '250' },
          { value: 500, title: '500' },
          { value: -1, title: '$vuetify.dataFooter.itemsPerPageAll' },
        ]"
        :items-per-page="100"
        expand-on-click
        item-value="Journal Acc No"
      >
        <template v-slot:expanded-row="{ item }">
          <tr>
            <td :colspan="journalHeaders.length">
              <!--create a simple table expanded using subTable data -->
              <div data-aos="fade-up">
                <v-data-table :items="item.subTable"></v-data-table>
              </div>
            </td>
          </tr>
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script setup>
import LibraryHeader from "../LibraryHeader.vue";

let searchText = ref("");

const journalsData = await queryContent("library", "journals").findOne();
const journals = journalsData.body;

const journalHeaders = [
  {
    title: "Journal Acc No",
    key: "Journal Acc No",
  },
  {
    title: "Journal Name",
    key: "Journal Name",
  },
  {
    title: "Nationality",
    key: "Nationality",
  },
];

const subTableHeaders = [
  {
    title: "Journal Volume #",
    key: "Journal Volume #",
  },
  {
    title: "Publication Year",
    key: "Publication Year",
  },
  {
    title: "Volume",
    key: "Volume",
  },
  {
    title: "Journal Volume Number",
    key: "Journal Volume Number",
  },
];
</script>

<script>
export default {
  data() {
    return {
      expanded: [],
    };
  },
};
</script>
