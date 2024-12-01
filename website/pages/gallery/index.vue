<template>
  <div>
    <div v-for="subsection in gallerySubsections" :key="subsection">
      <v-card
        class="mb-6 text-center"
        rounded="0"
        elevation="0"
        color="greenBg"
      >
        <v-card-title class="text-h5 font-weight-bold">
          {{ subsection }}
        </v-card-title>
      </v-card>

      <!-- display images -->
      <div class="d-flex flex-row flex-wrap">
        <div v-for="image in gallery[subsection]" :key="image">
          <galleryCard :image="image" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import galleryCard from "./galleryCard.vue";

const gallery = {
  "KSRI Gallery Collection 1": [
    {
      description: "Golden Jubilee Inauguration - 1994",
      imageUrl: "https://d30y75l38k1y9.cloudfront.net/upload/1-J4t.jpg",
    },
    {
      description: "Sanskrit and Medical science Seminar - On Jan.23, 1995",
      imageUrl: "https://d30y75l38k1y9.cloudfront.net/upload/3-WNF.jpg",
    },
  ],
  "Memories of KSRI": [
    {
      description:
        "Inaugration of the KSRInstitute by S.V.Ramamurthi I.C.S. on 22nd April 1945. L.to R.: K.M.Munshi, Sir.S.V.Ramamurthi, Rt.Hon'ble V.S. Srinivasa Sastri & Dr. S. Radhakrishnan",
      imageUrl: "https://d30y75l38k1y9.cloudfront.net/upload/1.jpg",
    },
    {
      description:
        "H.H. Jaya Chamarajendra Wadiyar, Maharajah of Mysore, at the Institute, seeing the Library. 1st September 1957",
      imageUrl: "https://d30y75l38k1y9.cloudfront.net/upload/3.jpg",
    },
  ],
};

const gallerySubsections = Object.keys(gallery);
</script>
