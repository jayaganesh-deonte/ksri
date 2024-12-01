<template>
  <div class="text-center mx-4">
    <section-title title="KSRI News Update" />
    <div class="text-h6" data-aos="fade-up-right" data-aos-delay="500">
      KSRI is an enabler of research for Indian and foreign scholars in their
      Doctorate pursuits.
    </div>

    <div>
      <v-row>
        <v-col
          v-for="(item, index) in news"
          :key="index"
          cols="12"
          sm="12"
          md="4"
        >
          <NewsCard :item="item" />
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script setup>
import NewsCard from "./NewsCard.vue";
const news = [
  {
    title: `The Pontiff of Uttaradi Mutt visited our institute on 17 October 2024 at 4 p.m. He evinced keen interest in our publications, library and reading some books and palm leaf manuscripts.`,
    avatarImage:
      "https://d30y75l38k1y9.cloudfront.net/upload/20241018_164550.jpg",
  },
  {
    title: `News The 166th Annual Convocation Ceremony was celebrated at the University of Madras on 24/09/2024. The following scholars from the KSRI, received their Ph.D. Degree Certificate from the Hon'ble Tamil Nadu Governor, Mr. R.N. Ravi. 1. Dr. S. Madhurambika 2. Dr. N. Bhuvaneswari 3. Dr. S.Goda Devi 4. Dr. K. Srikkanth 5. Dr. S. Balakrishnan 6. Dr. S. Renganayaki`,
    avatarImage: "https://d30y75l38k1y9.cloudfront.net/upload/1-kob.jpg",
  },
  {
    title: `The All India Radio - Akashvani Chennai, invited the faculty of KSRI to deliver radio talks for the "Samskrita Nigazhchi" ( Sanskrit" programme) - a specially curated programme that focuses on bringing to light various hidden treasures of Sanskrit to the public via the tamil language. This 15-min programme is aired every tuesday at 2.45pm. The details of the talks that were broadcasted are given below: 1) Dr. V Yamuna Devi, Deputy Director, The KSRI - 23rd & 30th July, 2024. a) काव्येषु मङ्गल श्लोकाः - part 1; b) part 2 2) Dr. P.C.Muralidharan, Asst. Professor, The KSRI. – 20th & 27th August, 2024. a) மழையின் கணிப்பு-பராசரரின் பார்வையில்; b) விதையின் பயன்பாடு - பராசரரின் பார்வையில் 3) Dr. V Annapurna, Research Associate, The KSRI - 17th and 24th September a)வடமொழியில் இரசாயன நூல்கள் மற்றும் ஆய்வுக்கூட அமைப்பு part ; b) part 2`,
  },
];
</script>
