<template>
  <div class="text-center mx-4">
    <section-title title="KSRI Events" />
    <div class="text-h6" data-aos="fade-up-right" data-aos-delay="500">
      KSRI organises many events periodically from its inception till date
    </div>
    <!-- display buttons to filter events -->
    <div>
      <div
        class="d-flex justify-center my-8"
        :class="$device.isMobile ? 'flex-wrap' : 'flex-row'"
      >
        <div v-for="(category, index) in storeEvents.categories" :key="index">
          <v-hover>
            <template v-slot:default="{ isHovering, props }">
              <v-btn
                v-bind="props"
                :color="
                  activeCategory === category
                    ? 'primary'
                    : isHovering
                    ? 'primary'
                    : 'secondary'
                "
                rounded="pill"
                :variant="activeCategory === category ? 'flat' : 'flat'"
                class="ma-2"
                @click="activeCategory = category"
              >
                {{ category }}
              </v-btn>
            </template>
          </v-hover>
        </div>
      </div>
    </div>

    <!-- display events -->
    <v-row v-if="selectedEvents.length > 0">
      <v-col
        v-for="(event, index) in selectedEvents"
        :key="index"
        cols="12"
        sm="12"
        md="6"
        data-aos="fade-up"
        :data-aos-delay="index * 10"
      >
        <!-- create two rows,in 2nd row have a button saying "Read More", in 1st row add two column, 1st col display event date  in format 25 Nov 2025 in 2nd col display event title and subtitle and category-->
        <event-card :event="event" />
      </v-col>
    </v-row>
    <div v-else class="text-h6">No events found</div>
  </div>
</template>

<script setup>
const description =
  "KSRI organises many events periodically from its inception till date";
useSeoMeta({
  title: "KSRI Events",
  description: description,
  ogTitle: "KSRI Events",
  ogDescription: description,
  twitterTitle: "KSRI Events",
  twitterDescription: description,
  twitterCard: "summary",
});

import eventCard from "~/components/events/eventCard.vue";

import { eventStore } from "~/stores/eventStore";

const storeEvents = await eventStore();

const events = storeEvents.events;

let activeCategory = ref("All");

const data = await queryContent("events", "events").findOne();
const categoriesData = await queryContent("events", "categories").findOne();

const getUpcomingEvents = () => {
  const today = new Date();
  const upcomingEvents = events.filter((event) => {
    const eventDate = new Date(event.date);
    return eventDate >= today;
  });
  return upcomingEvents;
};

const selectedEvents = computed(() => {
  if (activeCategory.value === "All") {
    return events;
  } else if (activeCategory.value === "Upcoming") {
    return getUpcomingEvents();
  } else {
    return events.filter((event) => {
      return event.category.includes(activeCategory.value);
    });
  }
});
</script>

<style scoped>
.eventsCategoryBtn:hover {
  color: red;
}
</style>
