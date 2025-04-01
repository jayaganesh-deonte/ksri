<template>
  <div>
    <!-- Search Icon -->
    <div @click="openSearchDialog" class="">
      <v-text-field
        class="ma-1"
        label="Search on KSRI"
        placeholder="Search on KSRI"
        append-inner-icon="mdi-magnify"
        single-line
        hide-details
        bg-color="pageBackground"
        density="dense"
        rounded="pill"
        variant="flat"
        readonly
      ></v-text-field>
    </div>
    <!-- <v-icon @click="openSearchDialog">mdi-magnify</v-icon> -->

    <!-- Search Dialog -->
    <v-dialog v-model="searchDialog" max-width="600px" persistent>
      <v-card>
        <div class="d-flex justify-space-between align-center pa-3">
          <div class="text-h6 font-weight-bold text-primary">Search</div>
          <v-btn icon variant="flat" size="small" @click="searchDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </div>

        <v-card-text>
          <!-- Search Input -->
          <v-text-field
            v-model="searchQuery"
            label="Search menu and options"
            variant="outlined"
            clearable
            @input="performSearch"
            density="compact"
          ></v-text-field>

          <!-- Search Results -->
          <v-list v-if="searchResults.length > 0">
            <v-list-item
              v-for="(result, index) in searchResults"
              :key="index"
              :to="result.link"
              @click="navigateBasedOnSearch(result)"
              color="primary"
            >
              <v-list-item-title class="font-weight-bold text-secondary">{{
                result.name
              }}</v-list-item-title>
              <div class="text-primary text-caption">
                {{ result.description }}
              </div>
              <v-divider />
            </v-list-item>
          </v-list>

          <!-- No Results Message -->
          <v-alert
            v-else-if="searchQuery && searchResults.length === 0"
            type="info"
            class="mt-3"
            color="secondary"
          >
            No results found
          </v-alert>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      searchDialog: false,
      searchQuery: "",
      searchResults: [],
      defaultResults: [
        {
          name: "Projects & Studies",
          description:
            "KSRI pursues many projects in Sanskrit scriptures and writings as well as Indology, to pursue its research objectives.",
          path: "/academic-and-research-pursuits/",
        },
        {
          name: "Library In House",
          description:
            "The uniqueness of the Institute's library is that it preserves the precious personal collections of great savants such as Dr.S.Radhakrishnan, Prof. Hiriyanna, Dr.V.Raghavan and others which are hardly available elsewhere.",
          path: "/library",
        },
        {
          name: "Publications",
          description: "Publications of the organization.",
          link: "/ksri-publications",
        },
      ],
      menuItems: [
        {
          name: "Home",
          description: "Kuppuswami Sastri Research Institute (KSRI) homepage",
          path: "/",
        },
        {
          name: "Vision & Mission",
          description:
            "At KSRI in pursuit of our stated vision will strive to make the Institute a preferred centre of learning in India for Sanskrit language and related Indology.",
          path: "/about-ksri/vision-and-mission",
        },
        {
          name: "Introduction & Overview",
          description:
            "Many research organizations/academic institutions were and are being founded in many parts of our country by exemplary men of vision.",
          path: "/about-ksri",
        },
        {
          name: "Kuppuswami Sastri Profile",
          description:
            "MAHAMAHOPADHYAYA, DARSANA KALANIDHI, VIDYAVACASPATI PROFESSOR KUPPUSWAMI SASTRI (1880-1943)",
          path: "/about-ksri/kuppuswami-sastri-profile",
        },
        {
          name: "Milestones",
          description:
            "The Silver Jubilee of the Institute was organised on a grand scale with a conference of scholars of Sanskrit and Indology, enaction of Sanskrit Play, release of books etc.",
          path: "/about-ksri/milestones",
        },
        {
          name: "Gallery",
          description:
            "Photo gallery showcasing KSRI events, scholars, and activities",
          path: "/gallery",
        },
        {
          name: "Projects & Studies",
          description:
            "KSRI pursues many projects in Sanskrit scriptures and writings as well as Indology, to pursue its research objectives.",
          path: "/academic-and-research-pursuits/",
        },
        {
          name: "Scholars Gateway",
          description:
            "The Kuppuswami Sastri Research Institute provides ample opportunities for scholars who are interested in higher studies.",
          path: "/academic-and-research-pursuits/scholars-gateway",
        },
        {
          name: "Modern Scholars",
          description:
            "The Kuppuswami Sastri Research Institute provides ample opportunities for scholars who are interested in higher studies (Ph.D. M.Phil).",
          path: "/academic-and-research-pursuits/scholars-gateway/modern-scholars",
        },
        {
          name: "Foreign Scholars",
          description:
            "The Kuppuswami Sastri Research Institute provides ample opportunities for scholars who are interested in higher studies (Ph.D. M.Phil).",
          path: "/academic-and-research-pursuits/scholars-gateway/foreign-scholars",
        },
        {
          name: "Academic Programs",
          description:
            "KSRI is affiliated to the University of Madras and offers Ph.D. programmes in Sanskrit. M.Phil. is not offered by University of Madras from 2024.",
          path: "/academic-and-research-pursuits/academic-programs",
        },
        {
          name: "KSRI Associates",
          description:
            "The KSRI is associated closely with many organizations such as Madras Sanskrit College, Sanskrit Academy, Samskrita Ranga and so on.",
          path: "/academic-and-research-pursuits/ksri-associates",
        },
        {
          name: "Seminars/Conferences",
          description:
            "KSRI has always been a centre for Sanskrit and Indology research. These activities are carried out through in-house Scholars and a society of associated Scholars.",
          path: "/academic-and-research-pursuits/seminars-and-conferences",
        },
        {
          name: "Governing Body",
          description:
            "Leadership and administrative team of the Kuppuswami Sastri Research Institute",
          path: "/ksri-team/",
        },
        {
          name: "Faculty",
          description: "Current faculty members and researchers at KSRI",
          path: "/ksri-team/faculty",
        },
        {
          name: "Editorial Committee",
          description:
            "Committee responsible for overseeing publications and academic content",
          path: "/ksri-team/editorialCommittee",
        },
        {
          name: "Research Committee",
          description: "Team guiding and managing research initiatives at KSRI",
          path: "/ksri-team/researchCommittee",
        },
        {
          name: "Advisory Committee",
          description:
            "Experienced advisors providing strategic guidance to the institute",
          path: "/ksri-team/advisoryCommittee",
        },
        {
          name: "Publications",
          description:
            "KSRI has been publishing the Journal of Oriental Research periodically from its inception till date and it is internationally well known.",
          path: "/ksri-publications",
        },
        {
          name: "Books",
          description:
            "Books and Monographs are being published periodically as an endeavour to promote Sanskrit and Indological Studies. They cover a wide range of subjects which include Vedic Studies, Yoga, Literature, Language, Grammar, Philosophy, Religion, Mathematics, Astronomy, Astrology, Medical Science, Ayurveda, Arthasastra, Purva Mimamsa, Advaita, Nyaya, Vaishnavism, Saivism, Arts, Science, etc.",
          path: "/ksri-publications/books",
        },
        {
          name: "Journal of Oriental Research",
          description:
            "KSRI has been publishing the Journal of Oriental Research periodically from its inception till date and it is internationally well-known. The journal is listed under the UGC CARE list of Journals - Arts & Humanities No. 367 with ISSN: 0022 - 3301.",
          path: "/ksri-publications/journals",
        },
        {
          name: "The Samskrita Academy, Madras",
          description:
            "The Samskrita Academy, Madras is a prestigious institution that offers a wide range of courses in Sanskrit and related subjects. It is located in Madras, Tamil Nadu, India.",
          path: "/ksri-publications/additionalPublications/The%20Samskrita%20Academy,%20Madras",
        },
        {
          name: "Library In House",
          description:
            "The uniqueness of the Institute's library is that it preserves the precious personal collections of great savants such as Dr.S.Radhakrishnan, Prof. Hiriyanna, Dr.V.Raghavan and others which are hardly available elsewhere.",
          path: "/library",
        },
        {
          name: "Library Books",
          description:
            "The uniqueness of the Institute's library is that it preserves the precious personal collections of great savants such as Dr.S.Radhakrishnan, Prof. Hiriyanna, Dr.V.Raghavan and others which are hardly available elsewhere.",
          path: "/library/library-books",
        },
        {
          name: "Library Articles",
          description:
            "The uniqueness of the Institute's library is that it preserves the precious personal collections of great savants such as Dr.S.Radhakrishnan, Prof. Hiriyanna, Dr.V.Raghavan and others which are hardly available elsewhere.",
          path: "/library/articles",
        },
        {
          name: "Library Journals",
          description:
            "The uniqueness of the Institute's library is that it preserves the precious personal collections of great savants such as Dr.S.Radhakrishnan, Prof. Hiriyanna, Dr.V.Raghavan and others which are hardly available elsewhere.",
          path: "/library/journals",
        },
        {
          name: "Library On Line",
          description:
            "KSRI is in the process of digitizing its treasure of old palm scripts, manuscripts, journals and rare books. KSRI hopes very soon it can offer valuable service by making the stored knowledge available to the world online.",
          path: "/library/library-on-line",
        },
        {
          name: "KSRI Events",
          description:
            "KSRI regularly conducts events and forums at its premises. All endowment events are also conducted in its premises. All are welcome to these programs.",
          path: "/events",
        },
        {
          name: "KSRI News",
          description: "KSRI latest news & announcement, articles",
          path: "/events/news",
        },
        {
          name: "Contribute Now",
          description:
            "Support the Kuppuswami Sastri Research Institute's mission and initiatives",
          path: "/payment/donation/",
        },
        {
          name: "Endowments",
          description:
            "Create an endowment to perpetuate the memory of your dear ones to hold a lecture annually in their names.",
          path: "/contribute/endowments",
        },
      ],
    };
  },
  methods: {
    openSearchDialog() {
      this.searchDialog = true;
      this.searchQuery = "";
      this.searchResults = this.defaultResults;
    },

    navigateBasedOnSearch(result) {
      console.log(result.path);
      const router = useRouter();
      router.push(result.path);
      this.searchDialog = false;
    },
    performSearch() {
      if (!this.searchQuery) {
        this.searchResults = this.defaultResults;
        return;
      }

      // Case-insensitive search across name and description
      const query = this.searchQuery.toLowerCase();
      this.searchResults = this.menuItems
        .filter(
          (item) =>
            item.name.toLowerCase().includes(query) ||
            item.description.toLowerCase().includes(query)
        )
        // Limit to top 5 results
        .slice(0, 5);
    },
  },
};
</script>

<style scoped>
/* Optional: Add some styling to make the search results more appealing */
.v-list-item {
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.v-list-item:hover {
  background-color: rgba(0, 0, 0, 0.05);
}
</style>
