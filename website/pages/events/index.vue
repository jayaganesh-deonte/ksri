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
import EventCard from "./eventCard.vue";

const events = [
  {
    title:
      "National Seminar on Bhakti Literature In Sanskrit and Tamil - DAY 2",
    subTitle:
      "National Seminar on Bhakti Literature In Sanskrit and Tamil – DAY 2",
    description: `As a Part of the 75th Anniversary, The KSRI conducted a National Seminar on Bhakti Literature In Sanskrit and Tamil" on 24th and 25th of November 2023 in collaboration with The Samskrita Academy, Madras.`,
    category: ["Seminars"],
    Venue: "Sri Chandrasekharendra Saraswati Mandapam, KSRI",
    date: "25/11/2024",
    additionalInformation: ``,
  },
  {
    title: "Dr. Lakshmi Kumari and Varun Krishna Endowment",
    subTitle: `PĀDUKĀ SAHASRAM OF SRI VEDANTA DESIKA - "VEDANTA DESIKA DAY"`,
    description: "Dr. P.C. Muralidharan (Asst. Prof., The KSRI)",
    category: ["Endowment Lectures"],
    date: "24/08/2024",
    time: "10:00 AM",
    Venue: "Sri Chandrasekharendra Saraswati Madapam, The KSRI",
    images: [],
  },

  {
    title: "National Workshop on Ancient Indian Mathematics and Astronomy",
    subTitle:
      "National Workshop on Ancient Indian Mathematics and Astronomy – 26 & 27 of July 2024",
    description:
      "The Kuppuswami Sastri Research Institute is celebrating its 75th anniversary. To commemorate this milestone the institute organized a Two day Workshop Ancient Indian Mathematics and Astronomy on 26th & 27th of July 2024",
    Venue: "Sri Chandrasekharendra Saraswati Madapam, The KSRI",
    date: "26/07/2024",
    additionalInformation: ``,
    category: ["Workshop"],
    images: [],
  },
  {
    title: "SYNOPSIS PRESENTATION",
    subTitle: "Sredhi Vyavahara -Progressions in Ancient Indian Mathematics",
    description: `Ph.D. candidate Ms. B. Vijayalakshmi, under the supervision of Dr. V. Yamuna Devi, Deputy Director, The KSRI, submitted her synopsis on "Sredhi Vyavahara -Progressions in Ancient Indian Mathematics" at the Institute premises on 20th August 2024.`,
    category: ["Synopsis", "Viva"],
    Venue: "Sri Chandrasekharendra Saraswati Madapam, The KSRI",
    date: "20/08/2024",
    additionalInformation: ``,
    images: [],
  },
  {
    title: "NARASIMHACHARI ENDOWMENT - SANSKRIT RECITATION COMPETITION",
    subTitle: "NARASIMHACHARI ENDOWMENT - SANSKRIT RECITATION COMPETITION",
    description: `Under the Narasimhachari endownment, The Kuppuswami Sastri Research Institute conducted a Sanskrit Sloka recitation Competition on 25th October 2024. Around 40 students from various city schools actively participated in the competition and recited 20 shlokas from either SUBRAMHANYA BHUJANGAM or SAUNDARYA LAHARI.`,
    category: ["Events"],
    Venue: "Sri Chandrasekharendra Saraswati Madapam, The KSRI",
    date: "25/10/2024",
    additionalInformation: ``,
    images: [],
  },
];

const eventCategories = [
  "Upcoming",
  "Seminars",
  "Endowment Lectures",
  "Workshop",
  "Viva",
  // "Awards",
  "Events",
  "All",
];

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
