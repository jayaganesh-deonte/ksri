<template>
  <div>
    <div class="ma-8">
      <section-title title="SEMINARS & CONFERENCES" />
    </div>

    <!-- display events -->
    <v-row class="ma-4">
      <v-col
        v-for="(event, index) in seminarsAndConferences"
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
useSeoMeta({
  title: "Seminars & Conferences",
  description: "Seminars & Conferences",
  ogTitle: "Seminars & Conferences",
  ogDescription: "Seminars & Conferences",
  twitterTitle: "Seminars & Conferences",
  twitterDescription: "Seminars & Conferences",
});

import eventCard from "~/components/events/eventCard.vue";

const eventsData = await queryContent("events", "events").findOne();

const events = eventsData.body;
const seminarsAndConferences = computed(() => {
  return events.filter((event) => {
    return (
      event.category.includes("Seminars") ||
      event.category.includes("Conferences")
    );
  });
});
</script>
