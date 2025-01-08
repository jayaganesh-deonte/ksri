<template>
  <div class="libraryHomeCard">
    <v-card class="ma-4 pa-4" elevation="0" rounded="0" color="transparent">
      <v-row>
        <v-col cols="12" md="6" class="d-flex justify-center align-center">
          <!-- libraryImages -->
          <v-carousel
            hide-delimiters
            show-arrows-on-hover
            hide-delimiter-background
            continuous
            :height="$device.isMobile ? '' : ''"
            :cycle="true"
            interval="3000"
          >
            <v-carousel-item
              v-for="imageUrl in libraryImages"
              :key="imageUrl"
              :src="imageUrl"
            ></v-carousel-item>
          </v-carousel>
        </v-col>
        <v-col cols="12" md="6">
          <div
            class="d-flex flex-column justify-space-around"
            style="height: 100%"
          >
            <div class="pa-4 text-white">
              <div class="text-h5 my-4">KSRI Library</div>
              <div class="my-2 text-h6">
                The Library comprises of nearly 65,000 books authored by great
                and popular writers on a variety of Sanskrit and Indological
                subjects.
              </div>
              <div class="d-flex my-2 text-h6">
                <nuxt-link :to="'/library'" style="text-decoration: unset">
                  <div class="text-white horizontalLineOnHoverAsUnderline">
                    Read More
                  </div>
                </nuxt-link>
                <!-- <nuxt-link :to="'/library'" style="text-decoration: unset">
                  <div class="mx-8 text-white horizontalLineOnHoverAsUnderline">
                    Library Membership
                  </div>
                </nuxt-link> -->
              </div>
            </div>
            <v-card class="pa-4" rounded="0" elevation="0">
              <div class="text-h5 my-4 font-weight-bold">Library Online</div>
              <div class="my-2 text-h6">
                Presently KSRI has started digitizing all old and rare Palm-leaf
                manuscripts in its collection.
              </div>
              <div class="d-flex my-2 text-h6">
                <nuxt-link
                  :to="'/library/library-on-line'"
                  style="text-decoration: unset"
                >
                  <div class="text-black horizontalLineOnHoverAsUnderline">
                    Read More
                  </div>
                </nuxt-link>
                <!-- <nuxt-link
                  :to="'/library/library-on-line'"
                  style="text-decoration: unset"
                >
                  <div class="mx-8 text-black horizontalLineOnHoverAsUnderline">
                    Get Involved with Us
                  </div>
                </nuxt-link> -->
              </div>
            </v-card>
          </div>
        </v-col>
      </v-row>
      <div class="my-8">
        <div class="text-h5 font-weight-bold text-white">
          Help us protect old and rare books
        </div>
        <div class="text-h4 font-weight-bold text-white my-2">
          BECOME A SPONSOR OR VOLUNTEER FOR DIGITIZATION
        </div>
      </div>
      <div
        class="my-8 d-flex"
        :class="`${$device.isMobile ? 'flex-column' : 'flex-row'}`"
      >
        <v-btn
          color="primary ma-2"
          rounded="pill"
          :to="'/contribute'"
          :block="$device.isMobile"
        >
          Contribute</v-btn
        >
        <v-btn
          :block="$device.isMobile"
          class="ma-2"
          color="white"
          rounded="pill"
          :to="'/contact-us'"
        >
          Enquire!</v-btn
        >
      </div>
    </v-card>
  </div>
</template>

<script setup>
const libraryImages = [
  "/img/NEW LIBRARY IMAGES/new lib 8.PNG",
  "/img/NEW LIBRARY IMAGES/new lib 9.PNG",
  "/img/NEW LIBRARY IMAGES/new lib 10.PNG",
  "/img/NEW LIBRARY IMAGES/new lib 11.PNG",
  "/img/NEW LIBRARY IMAGES/new lib 1.PNG",
  "/img/NEW LIBRARY IMAGES/new lib 2.PNG",
  "/img/NEW LIBRARY IMAGES/new lib 3.PNG",
  "/img/NEW LIBRARY IMAGES/new lib 4.PNG",
  "/img/NEW LIBRARY IMAGES/new lib 5.PNG",
  "/img/NEW LIBRARY IMAGES/new lib 6.PNG",
  "/img/NEW LIBRARY IMAGES/new lib 7.PNG",
];
</script>

<style scoped>
.libraryHomeCard {
  /*set background color for first vertical half as green and 2nd vertical half as yello*/
  background: linear-gradient(to bottom, #09341c 50%, #09341c 50%);
  /*set background color for first vertical half as green and 2nd vertical half as yello*/
  background-size: 100% 50%;
  background-repeat: no-repeat;
  background-position: top;
  background-color: #bf641f;
}
</style>
