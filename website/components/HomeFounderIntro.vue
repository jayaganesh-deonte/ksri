<template>
  <v-card
    color="secondary"
    elevation="0"
    rounded="0"
    class="pa-6"
    id="homeFounderIntro"
  >
    <v-row>
      <!-- founder image to left and text to right -->
      <v-col
        cols="12"
        sm="12"
        md="4"
        lg="4"
        align="center"
        justify="center"
        data-aos="fade-right"
        data-aos-delay="200"
      >
        <v-img src="/img/founder.png" cover width="250"></v-img>
      </v-col>
      <v-col cols="12" sm="12" md="8" lg="8">
        <div
          class="text-h5 defaultFont"
          data-aos="fade-left"
          data-aos-delay="200"
        >
          Founded in the fond memory of
        </div>
        <div
          class="text-h3 defaultFont mt-1 mb-6"
          data-aos="fade-left"
          data-aos-delay="250"
        >
          Mm. Prof. S. Kuppuswami Sastri
        </div>
        <div
          class="defaultFont text-h6"
          data-aos="fade-left"
          data-aos-delay="300"
        >
          Mm. Prof. S. Kuppuswami Sastri was a Sanskrit Scholar of repute in
          India during his time and had devoted his life time to study of
          Sanskrit and Indology. He was a Professor, Editor and Author in
          Sanskrit Language and of Sanskrit heritage in other languages. He was
          a well know literary figure of yesteryears in India and abroad after
          India. KSRI was established in 1945 as a fitting tribute to him and
          his contributions to Sanskrit heritage and related Indology.
        </div>
        <div class="mt-2" data-aos="fade-left" data-aos-delay="350">
          <v-btn
            rounded="pill"
            color="primary"
            :to="'/about-ksri/kuppuswami-sastri-profile'"
          >
            Read More
          </v-btn>
        </div>
      </v-col>
    </v-row>
  </v-card>
</template>

<style scoped>
/*set background image as /img/icons/dome.png and align it to right side and set /img/icons/founder-backdrop.png to left side*/
#homeFounderIntro {
  background-image: url("/img/icons/dome.png"),
    url("/img/icons/founder-backdrop.png");
  background-repeat: no-repeat, no-repeat;
  background-size: contain, cover;
  background-position: right center, left center;
}
</style>
