<template>
  <div>
    <div v-if="!journalInfoFetched" class="d-flex justify-center ma-6">
      <!-- show loader -->
      <v-progress-circular
        size="100"
        indeterminate
        color="primary"
      ></v-progress-circular>
    </div>
    <div v-else>
      <!-- display journal details -->
      <!-- two cols, 1st col with image as carousel, 2nd col with journal details, title, subtitle, price and then details -->
      <div v-if="journalNotFound" class="d-flex justify-center ma-6">
        <!-- 404 component -->
        <div class="d-flex flex-column justify-center align-center">
          <div class="text-h1 text-secondary">404</div>
          <div class="text-h4 text-secondary">Journal Not Found</div>
          <div class="text-body-1 text-secondary">
            The Journal you are looking for does not exist.
          </div>
          <div class="d-flex justify-center ma-4">
            <v-btn
              rounded="pill"
              variant="flat"
              color="primary"
              to="/ksri-publications/journals/"
            >
              Back to Book Catalogue
            </v-btn>
          </div>
        </div>
      </div>
      <div class="ma-4" v-else>
        <div class="d-flex justify-center ma-4">
          <v-btn
            rounded="pill"
            variant="flat"
            color="primary"
            to="/ksri-publications/journals/"
          >
            Back to Catalogue
          </v-btn>
        </div>
        <v-row>
          <v-col cols="12" md="6" data-aos="fade-right">
            <v-carousel
              hide-delimiters
              hide-delimiter-background
              show-arrows-on-hover
            >
              <template v-if="journalInfo.imageUrls">
                <v-carousel-item
                  v-for="imageUrl in journalInfo.imageUrls"
                  :key="imageUrl"
                >
                  <v-img :src="getImageUrl(imageUrl)" fit></v-img>
                </v-carousel-item>
              </template>
              <template v-else>
                <v-carousel-item>
                  <v-img src="/img/ksri-logo.png" fit></v-img>
                </v-carousel-item>
              </template>
            </v-carousel>
          </v-col>
          <v-col
            cols="12"
            md="6"
            class="d-flex flex-column justify-space-around"
          >
            <div>
              <div
                class="text-h5 text-secondary font-weight-bold"
                data-aos="fade-left"
                data-aos-delay="100"
              >
                {{ journalInfo.title }}
              </div>
              <div
                class="text-h6 font-weight-bold"
                data-aos="fade-left"
                data-aos-delay="200"
              >
                {{ journalInfo.subtitle }}
              </div>
              <div
                class="text-h6 text-primary my-4 font-weight-bold"
                data-aos="fade-left"
                data-aos-delay="300"
                v-if="
                  journalInfo.price &&
                  journalInfo.price != '' &&
                  journalInfo.price != '0' &&
                  journalInfo.price != '0.00'
                "
              >
                Price:
                <span class="text-secondary">
                  {{ journalInfo.price }}
                </span>
              </div>
              <!-- year of publication -->
              <div
                class="text-h6 text-primary my-4 font-weight-bold"
                data-aos="fade-left"
                data-aos-delay="300"
              >
                Year of Publication:

                <span class="text-secondary font-weight-bold">
                  {{ journalInfo.yearOfPublication }}
                </span>
              </div>

              <div
                class="pa-0 mt-5 text-danger"
                v-if="journalInfo.available != 'Yes'"
                data-aos-delay="400"
              >
                <v-chip color="error" label outlined rounded="pill">
                  Out of Stock
                </v-chip>
              </div>
            </div>
            <div
              class="text-body-1 font-weight-bold"
              data-aos="fade-left"
              data-aos-delay="400"
            >
              <!-- {{ journalInfo.details }} -->
              <div v-html="journalInfo.details"></div>
            </div>
          </v-col>
        </v-row>
      </div>
    </div>
  </div>
</template>

<script setup>
const additionalPublicationsData = await queryContent(
  "publications",
  "additionalpublications"
).findOne();
const additionalPublications = additionalPublicationsData.body;
console.log("additionalPublications", additionalPublications);

let additionalPublicationJournals = {};

// for additionalPublications query content
for (const element of additionalPublications) {
  const additionalPublication = element;

  const publicationNameForFile = additionalPublication
    .replace(/[^a-zA-Z0-9]/g, "")
    .toLowerCase();

  // query content
  const additionalPublicationJournalsData = await queryContent(
    "publications",
    publicationNameForFile + "journals"
  ).findOne();

  additionalPublicationJournals[additionalPublication] =
    additionalPublicationJournalsData.body;
}

const journalsData = await queryContent("publications", "journals").findOne();

const ksriJournals = journalsData.body;

additionalPublicationJournals["KSRI"] = ksriJournals;

let journals = reactive([]);

for (const [publication, publicationJournals] of Object.entries(
  additionalPublicationJournals
)) {
  journals.push(...publicationJournals);
}

onMounted(async () => {
  getBookInfo();
});

// get journal id from route
const route = useRoute();

const journalInfoFetched = ref(false);

const journalNotFound = ref(false);

const journalInfo = reactive({
  title: "",
  subtitle: "",
  price: "",
  imageUrls: "",
  details: "",
  id: "",
  available: "",
  publication: "",
  yearOfPublication: "",
});
const getBookById = (id) => {
  // find journal from journal & samskritaAcademyPublicationJournals list if not found return null
  const journal = journals.find((journal) => journal.id === id);
  if (journal) {
    return journal;
  }
  return null;
};
// get journals
const getBookInfo = async () => {
  const journal = getBookById(route.params.id);

  if (journal == null) {
    journalNotFound.value = true;
  } else {
    journalInfo.title = journal.title;
    journalInfo.subtitle = journal.subtitle;
    journalInfo.price = journal.price;
    journalInfo.imageUrls = journal.imageUrls;
    journalInfo.details = journal.details;
    journalInfo.id = journal.id;
    journalInfo.available = journal.available;
    journalInfo.publication = journal.publication;
    journalInfo.yearOfPublication = journal.yearOfPublication;
  }
  journalInfoFetched.value = true;

  useSeoMeta({
    title: journal.title,
    description: journal.subtitle,
    ogTitle: journal.title,
    ogDescription: journal.subtitle,
    twitterTitle: journal.title,
    twitterDescription: journal.subtitle,
  });
};

const getImageUrl = (url) => {
  const runtimeConfig = useRuntimeConfig();
  return runtimeConfig.public.ASSET_DOMAIN + url;
};
</script>
