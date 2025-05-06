<template>
  <div>
    <v-card elevation="0" rounded="0" color="pageBackground">
      <div class="pa-4">
        <section-title title="CONTRIBUTE" />
        <div class="sectionSubtitle2" data-aos="fade-up">
          We earnestly solicit contributions from lovers of Sanskrit and Indian
          culture to help us by contributing their mite in preserving our
          ancient treasure.
        </div>
      </div>
    </v-card>

    <v-card rounded="0" class="ma-0">
      <v-img
        :height="$device.isMobile ? 'auto' : '50vh'"
        src="/img/library/library-racks-5.jpg"
        cover
        class="d-flex justify-center align-center"
      >
        <v-card
          color="primary"
          :max-width="$device.isMobile ? '' : '50vw'"
          class="ma-4 mx-auto text-justify pa-4"
          :class="$device.isMobile ? 'text-body-1' : 'text-h6'"
        >
          Corpus: To continue to march ahead and to train youngsters in this
          noble task, it requires sound financial backing. We may require about
          INR 400,000,000 (Rs.40 crores approx.) - $ 6,000,000.
        </v-card>
      </v-img>
      <v-card
        class="text-h6 text-justify pa-4"
        color="secondary"
        elevation="0"
        rounded="0"
      >
        We earnestly solicit contributions from lovers of Sanskrit and Indian
        culture to help us by contributing their mite in preserving our ancient
        treasure. Donation given to our Institute is exempt from Income tax
        under Sec.35 (i) (iii) of the Income Tax Act.
      </v-card>
    </v-card>
  </div>
</template>
