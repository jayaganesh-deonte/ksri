<template>
  <div class="ma-8">
    <div class="text-center my-12">
      <div
        class="text-h4 text-secondary font-weight-bold"
        data-aos="fade-up"
        data-aos-delay="200"
      >
        KSRI LIBRARY ONLINE
      </div>
      <div class="sectionBody" data-aos="fade-up" data-aos-delay="200">
        KSRI has already digitized the entire collection of palm-leaf
        manuscripts and paper manuscripts. More 1200 old and rare books have
        also been digitized.
      </div>
    </div>
    <div class="mx-2 my-8">
      <div class="sectionSubtitle my-4" data-aos="fade-up">
        Focus on Digitization of Mss. and Rare Books
      </div>
      <v-row>
        <v-col class="ma-0 pa-0">
          <v-img class="" src="/img/library/library-racks-2.jpg" cover> </v-img>
        </v-col>
        <v-col class="ma-0 pa-0">
          <v-card
            class="sectionBody font-weight-bold d-flex text-justify align-center pa-2 ma-0"
            rounded="0"
            elevation="0"
            height="100%"
            data-aos="fade-left"
          >
            Realising the importance of the collection, the Institute is trying
            to digitize the old books (70- 100 years old) and the Manuscripts.
            Under the Millennium Project envisaged by the former President
            Dr.A.P.J. Abdul Kalam, the Tirumala Tirupati Devasthanam has
            digitalized nearly 3000 books published before 1950 on various
            subjects.
          </v-card>
        </v-col>
      </v-row>

      <!-- for mobile -->
      <v-card
        class="my-4"
        color="greenBg"
        elevation="0"
        data-aos="zoom-in"
        data-aos-delay="400"
        v-if="$device.isMobile"
      >
        <v-img :src="getAssetUrl('upload/library-focus.jpg')" cover></v-img>
        <div
          class="sectionBody text-start ma-2"
          data-aos="fade-up"
          data-aos-delay="900"
        >
          Realising the importance of the collection, the Institute is trying to
          digitize the old books (70- 100 years old) and the Manuscripts. Under
          the Millennium Project envisaged by the former President Dr.A.P.J.
          Abdul Kalam, the Tirumala Tirupati Devasthanam has digitalized nearly
          3000 books published before 1950 on various subjects.
        </div>
      </v-card>
    </div>

    <div class="text-center">
      <div
        class="sectionSubtitle my-4"
        data-aos="fade-right"
        data-aos-delay="200"
      >
        Overview
      </div>
      <div class="sectionBody" data-aos="fade-left" data-aos-delay="200">
        KSRI hopes that it can offer online service by making the valuable
        knowledge available to the world very soon.
      </div>
    </div>

    <v-card
      class="onlineLibBg d-flex flex-column justify-end my-8"
      :min-height="$device.isMobile ? '' : '50vh'"
      data-aos="fade-up"
      data-aos-delay="200"
      rounded="0"
    >
      <v-card
        color="primary pa-4 ma-6 sectionBody mx-auto"
        :class="$device.isMobile ? ' text-center' : ''"
        :max-width="$device.isMobile ? '80%' : '40%'"
        data-aos="fade-up"
        data-aos-delay="200"
        rounded="0"
      >
        <div class="ma-2 font-weight-bold">
          Under Phase 1 all the palm-leaf manuscripts in the library have been
          digitised. The major expenditure was met with from the donation given
          by M/s RANE group, Chennai. Presently old and rare books(more than
          100-200 years old) are being digitised. Thanks to the donations from
          some philanthropists and corporate groups like Dr. Reddy’s Foundation,
          M/s Brakes India Private Ltd., we are in the process of digitising
          more than 1000 books.

          <br />
          Once the digitisation is done, the Institute would upload the
          digitised books/manuscripts.
        </div>
      </v-card>
    </v-card>
  </div>
</template>

<script setup>
const description =
  "KSRI has already digitalized the entire collection of palm leaf manuscripts and paper manuscripts. Around 1100 old and rare books have also been digitalized.";

useSeoMeta({
  title: "KSRI Library Online",
  description: description,
  ogTitle: "KSRI Library Online",
  ogDescription: description,
  twitterTitle: "KSRI Library Online",
  twitterDescription: description,
});
</script>
<style scoped>
.onlineLibBg {
  background-image: url("/img/library/library-racks-1.jpg");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

/* imageWithTextAlignedToRight and textOverlay: make textOverlay appear on top of image 30% above image*/
.imageWithTextAlignedToRight {
  position: relative;
}

.textOverlay {
  background-color: #bf641f;
  position: absolute;
  top: 30%;
  left: 20%;
}

.imgOnRight {
  position: absolute;
  top: 0;
  right: 0;
}

.textOverlayRight {
  position: absolute;
  top: 30%;
  right: 20%;
}
</style>
