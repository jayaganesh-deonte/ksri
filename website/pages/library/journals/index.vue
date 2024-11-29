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

const journals = [
  {
    "Journal Acc No": 1,
    "Journal Name": "JOURNAL OF ASIATIQUE",
    Nationality: "FOREIGN",
    subTable: [
      {
        "Journal Volume #": 1,
        "Publication Year": 1949,
        Volume: 237,
        "Journal Volume Number": "1,2",
      },
      {
        "Journal Volume #": 2,
        "Publication Year": 1950,
        Volume: 238,
        "Journal Volume Number": 2,
      },
      {
        "Journal Volume #": 3,
        "Publication Year": 1951,
        Volume: 239,
        "Journal Volume Number": "1,2,3",
      },
      {
        "Journal Volume #": 4,
        "Publication Year": 1952,
        Volume: 240,
        "Journal Volume Number": "2,3,4",
      },
      {
        "Journal Volume #": 5,
        "Publication Year": 1953,
        Volume: 241,
        "Journal Volume Number": "1,2,3,4",
      },
      {
        "Journal Volume #": 6,
        "Publication Year": 1954,
        Volume: 242,
        "Journal Volume Number": "2,3,4",
      },
      {
        "Journal Volume #": 9,
        "Publication Year": 1955,
        Volume: 243,
        "Journal Volume Number": "3,4",
      },
      {
        "Journal Volume #": 10,
        "Publication Year": 1956,
        Volume: "-",
        "Journal Volume Number": "-",
      },
    ],
  },
  {
    "Journal Acc No": 2,
    "Journal Name": "ARCHIV ORIENTALINI",
    Nationality: "FOREIGN",
    subTable: [
      {
        "Journal Volume #": 1,
        "Publication Year": 1949,
        Volume: 237,
        "Journal Volume Number": "1,2",
      },
      {
        "Journal Volume #": 2,
        "Publication Year": 1950,
        Volume: 238,
        "Journal Volume Number": 2,
      },
      {
        "Journal Volume #": 3,
        "Publication Year": 1951,
        Volume: 239,
        "Journal Volume Number": "1,2,3",
      },
      {
        "Journal Volume #": 4,
        "Publication Year": 1952,
        Volume: 240,
        "Journal Volume Number": "2,3,4",
      },
      {
        "Journal Volume #": 5,
        "Publication Year": 1953,
        Volume: 241,
        "Journal Volume Number": "1,2,3,4",
      },
      {
        "Journal Volume #": 6,
        "Publication Year": 1954,
        Volume: 242,
        "Journal Volume Number": "2,3,4",
      },
      {
        "Journal Volume #": 9,
        "Publication Year": 1955,
        Volume: 243,
        "Journal Volume Number": "3,4",
      },
      {
        "Journal Volume #": 10,
        "Publication Year": 1956,
        Volume: "-",
        "Journal Volume Number": "-",
      },
    ],
  },
  {
    "Journal Acc No": 3,
    "Journal Name": "ASIAN STUDIES PHILIPINES",
    Nationality: "FOREIGN",
    subTable: [
      {
        "Journal Volume #": 1,
        "Publication Year": 1949,
        Volume: 237,
        "Journal Volume Number": "1,2",
      },
      {
        "Journal Volume #": 2,
        "Publication Year": 1950,
        Volume: 238,
        "Journal Volume Number": 2,
      },
      {
        "Journal Volume #": 3,
        "Publication Year": 1951,
        Volume: 239,
        "Journal Volume Number": "1,2,3",
      },
      {
        "Journal Volume #": 4,
        "Publication Year": 1952,
        Volume: 240,
        "Journal Volume Number": "2,3,4",
      },
      {
        "Journal Volume #": 5,
        "Publication Year": 1953,
        Volume: 241,
        "Journal Volume Number": "1,2,3,4",
      },
      {
        "Journal Volume #": 6,
        "Publication Year": 1954,
        Volume: 242,
        "Journal Volume Number": "2,3,4",
      },
      {
        "Journal Volume #": 9,
        "Publication Year": 1955,
        Volume: 243,
        "Journal Volume Number": "3,4",
      },
      {
        "Journal Volume #": 10,
        "Publication Year": 1956,
        Volume: "-",
        "Journal Volume Number": "-",
      },
    ],
  },
  {
    "Journal Acc No": 4,
    "Journal Name": "BULLETIN DE I ECOLE FRANCAISE",
    Nationality: "FOREIGN",
    subTable: [
      {
        "Journal Volume #": 1,
        "Publication Year": 1949,
        Volume: 237,
        "Journal Volume Number": "1,2",
      },
      {
        "Journal Volume #": 2,
        "Publication Year": 1950,
        Volume: 238,
        "Journal Volume Number": 2,
      },
      {
        "Journal Volume #": 3,
        "Publication Year": 1951,
        Volume: 239,
        "Journal Volume Number": "1,2,3",
      },
      {
        "Journal Volume #": 4,
        "Publication Year": 1952,
        Volume: 240,
        "Journal Volume Number": "2,3,4",
      },
      {
        "Journal Volume #": 5,
        "Publication Year": 1953,
        Volume: 241,
        "Journal Volume Number": "1,2,3,4",
      },
      {
        "Journal Volume #": 6,
        "Publication Year": 1954,
        Volume: 242,
        "Journal Volume Number": "2,3,4",
      },
      {
        "Journal Volume #": 9,
        "Publication Year": 1955,
        Volume: 243,
        "Journal Volume Number": "3,4",
      },
      {
        "Journal Volume #": 10,
        "Publication Year": 1956,
        Volume: "-",
        "Journal Volume Number": "-",
      },
    ],
  },
  {
    "Journal Acc No": 5,
    "Journal Name": "INDIAN AND BUDDHIST STUDIES",
    Nationality: "FOREIGN",
    subTable: [
      {
        "Journal Volume #": 1,
        "Publication Year": 1949,
        Volume: 237,
        "Journal Volume Number": "1,2",
      },
      {
        "Journal Volume #": 2,
        "Publication Year": 1950,
        Volume: 238,
        "Journal Volume Number": 2,
      },
      {
        "Journal Volume #": 3,
        "Publication Year": 1951,
        Volume: 239,
        "Journal Volume Number": "1,2,3",
      },
      {
        "Journal Volume #": 4,
        "Publication Year": 1952,
        Volume: 240,
        "Journal Volume Number": "2,3,4",
      },
      {
        "Journal Volume #": 5,
        "Publication Year": 1953,
        Volume: 241,
        "Journal Volume Number": "1,2,3,4",
      },
      {
        "Journal Volume #": 6,
        "Publication Year": 1954,
        Volume: 242,
        "Journal Volume Number": "2,3,4",
      },
      {
        "Journal Volume #": 9,
        "Publication Year": 1955,
        Volume: 243,
        "Journal Volume Number": "3,4",
      },
      {
        "Journal Volume #": 10,
        "Publication Year": 1956,
        Volume: "-",
        "Journal Volume Number": "-",
      },
    ],
  },
];

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
