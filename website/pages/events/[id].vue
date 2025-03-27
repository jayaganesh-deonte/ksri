<template>
  <div class="mx-4">
    <!-- back to all events -->
    <div class="text-center ma-4">
      <v-btn color="primary" rounded="pill" variant="flat" to="/events/">
        Back to All Events
      </v-btn>
    </div>
    <section-title title="KSRI Events" />
    <div class="text-h6 text-center" data-aos="fade-up-right">
      KSRI organises many events periodically from its inception till date
    </div>
    <v-card rounded="0" class="my-4 pa-4">
      <!-- add subtitle -->

      <div
        class="my-2 text-h4 font-weight-bold text-secondary text-uppercase"
        data-aos="fade-up"
      >
        {{ event.title }}
      </div>
      <div
        class="text-subtitle-1 font-weight-bold text-primary"
        data-aos="fade-up"
      >
        {{ event.subtitle }}
      </div>

      <!-- add one row with 3 cols for category, venue and date -->
      <v-row class="ma-4 pa-2">
        <v-col
          cols="12"
          md="4"
          class="eventCol"
          data-aos="fade-up"
          data-aos-delay="100"
        >
          <div class="text-subtitle-1 font-weight-bold text-secondary">
            Category:
          </div>
          <div>{{ event.category.join(", ") }}</div>
        </v-col>
        <v-col
          cols="12"
          md="4"
          class="eventCol"
          data-aos="fade-up"
          data-aos-delay="200"
        >
          <div class="text-subtitle-1 font-weight-bold text-secondary">
            Venue:
          </div>
          <div>{{ event.venue }}</div>
        </v-col>
        <v-col
          cols="12"
          md="4"
          class="eventCol"
          data-aos="fade-up"
          data-aos-delay="300"
        >
          <div class="text-subtitle-1 font-weight-bold text-secondary">
            Date:
          </div>
          <div>{{ event.date }}</div>
        </v-col>
      </v-row>
      <v-row v-if="displayImageInColumns">
        <v-col cols="12" md="8">
          <div data-aos="fade-up">
            <div v-html="event.description"></div>
          </div>
        </v-col>
        <v-col cols="12" md="4">
          <!-- display images vertically -->
          <v-card color="rgb(191, 100, 31,0.5)" elevation="0" rounded="0">
            <v-row class="ma-1 pa-1">
              <v-col
                v-for="(image, index) in verticalImages"
                :key="index"
                cols="12"
                md="12"
                class="ma-0 pa-1"
              >
                <v-img
                  :src="getImageUrl(image)"
                  fit
                  :height="`${$device.isMobile ? '' : '30vh'}`"
                ></v-img>
                <!-- <div class="text-subtitle-1 font-weight-bold text-secondary">
                  {{ event.title }}
                </div> -->
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
      <div data-aos="fade-up" v-else>
        <div v-html="event.description"></div>
      </div>

      <v-divider />

      <!-- images -->
      <!-- <div class="my-4 d-flex flex-wrap justify-center align-center">
        <v-img
          v-for="(image, index) in event.images"
          :key="index"
          :src="image"
          :max-width="$device.isMobile ? '100%' : '50%'"
          data-aos="fade-up"
          :data-aos-delay="index * 100"
          fit
        ></v-img>
      </div> -->
      <v-card color="rgb(191, 100, 31,0.5)" elevation="0" rounded="0">
        <v-row class="ma-1 pa-1">
          <v-col
            v-for="(image, index) in horizontalImages"
            :key="index"
            cols="12"
            md="3"
            class="ma-0 pa-1"
          >
            <v-img
              :src="getImageUrl(image)"
              fit
              :height="`${$device.isMobile ? '' : '30vh'}`"
            ></v-img>
          </v-col> </v-row
      ></v-card>

      <!-- display next and previous btns -->
      <div class="ma-8 text-center">
        <v-btn
          color="primary"
          variant="outlined"
          rounded="pill"
          v-if="displayPreviousButton"
          :to="`/events/${previousEventId}`"
          class="mx-4"
        >
          Previous
        </v-btn>

        <v-btn
          color="primary"
          variant="outlined"
          rounded="pill"
          v-if="displayNextButton"
          class="mx-4"
          :to="`/events/${nextEventId}`"
        >
          Next
        </v-btn>
      </div>
    </v-card>
  </div>
</template>

<script setup>
import { eventStore } from "~/stores/eventStore";

const storeEvents = await eventStore();

const route = useRoute();
console.log(route.params.id);

let eventInfo = reactive({});

let displayNextButton = ref(false);
let displayPreviousButton = ref(false);

let nextEventId = ref("");
let previousEventId = ref("");

// get event info
const event = await storeEvents.getEventById(route.params.id);

Object.assign(eventInfo, event);

const pagination = storeEvents.getEventPagination(route.params.id);

displayNextButton.value = pagination.displayNextButton;
displayPreviousButton.value = pagination.displayPreviousButton;

nextEventId.value = pagination.nextEventId;
previousEventId.value = pagination.previousEventId;

useSeoMeta({
  title: eventInfo.title,
  description: eventInfo.description,
  ogTitle: eventInfo.title,
  ogDescription: eventInfo.description,
  twitterTitle: eventInfo.title,
  twitterDescription: eventInfo.description,
});

const getImageUrl = (url) => {
  const runtimeConfig = useRuntimeConfig();
  return runtimeConfig.public.ASSET_DOMAIN + url;
};

// return true in event.category contians seminars
const displayImageInColumns = computed(() => {
  const includedEvents = ["Seminars", "Workshop"];
  const categoryMatch = eventInfo.category
    .map((cat) => cat.toLowerCase())
    .some((cat) => includedEvents.map((e) => e.toLowerCase()).includes(cat));

  // Check description length - if less than 200 characters, display single column
  const descriptionLength = eventInfo.description.replace(
    /<[^>]*>/g,
    ""
  ).length;
  console.log("descriptionLength", descriptionLength);
  const isShortDescription = descriptionLength < 2000;

  return categoryMatch && !isShortDescription;
});

// first 10 images to be in vertical and rest in horizontal
const verticalImages = eventInfo.images.slice(0, 10);
const horizontalImages = displayImageInColumns
  ? eventInfo.images.slice(10)
  : eventInfo.images;
</script>

<style scoped>
.eventCol {
  /*add border*/
  border: 1px solid rgba(0, 0, 0, 0.12);
}
</style>
