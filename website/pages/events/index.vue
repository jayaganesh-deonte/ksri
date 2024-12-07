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
        <div v-for="(category, index) in eventCategories" :key="index">
          <v-btn
            color="primary"
            rounded="pill"
            :variant="activeCategory === category ? 'flat' : 'outlined'"
            class="ma-2"
            @click="activeCategory = category"
          >
            {{ category }}
          </v-btn>
        </div>
      </div>
    </div>

    <!-- display events -->
    <v-row>
      <v-col
        v-for="(event, index) in selectedEvents"
        :key="index"
        cols="12"
        sm="12"
        md="6"
        data-aos="fade-up"
        :data-aos-delay="index * 500"
      >
        <!-- create two rows,in 2nd row have a button saying "Read More", in 1st row add two column, 1st col display event date  in format 25 Nov 2025 in 2nd col display event title and subtitle and category-->
        <event-card :event="event" />
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
import eventCard from "~/components/events/eventCard.vue";

const eventsData = await queryContent("events", "events").findOne();

const events = eventsData.body;

const eventCategoriesData = await queryContent(
  "events",
  "categories"
).findOne();

const eventCategories = eventCategoriesData.body;

// let activeCategory = ref("Upcoming");

let activeCategory = ref("All");

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
