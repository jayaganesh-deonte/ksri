<template>
  <v-card color="primary" rounded="0" elevation="0">
    <v-row align="center" justify="center" class="ma-4">
      <v-col
        cols="12"
        sm="12"
        md="5"
        class="d-flex flex-column justify-center"
        data-aos="fade-right"
        data-aos-delay="100"
      >
        <div
          class="text-h4 font-weight-bold defaultFont my-4"
          data-aos="zoom-out-up"
          data-aos-delay="200"
        >
          CONTRIBUTE
        </div>
        <div
          class="text-h6 defaultFont text-justify"
          data-aos="zoom-out-up"
          data-aos-delay="250"
        >
          KSRI will be grateful to receive contributions and sponsorships for
          its corpus and projects. Donations will go a long way in preserving
          Sanskrit and Indological Studies.
        </div>
        <div
          class="text-h6 defaultFont text-justify"
          data-aos="zoom-out-up"
          data-aos-delay="250"
        >
          <br />
          Corpus: The Institute is facing acute financial constraints
          Nevertheless its past record and present contribution to the cause of
          Sanskrit and Indian culture are unmatched. To continue to march ahead
          and to train youngsters in this noble task, it requires sound
          financial backing. We may require about INR 400,000,000 (Rs.40 crores
          approx.) - $ 6,000,000.
        </div>

        <div
          class="mt-4"
          data-aos="zoom-out-up"
          data-aos-delay="300"
          v-if="displayContributeButton"
        >
          <v-btn rounded="pill" color="secondary" :to="'/contribute'"
            >Contribute</v-btn
          >
        </div>
      </v-col>
      <v-col
        cols="12"
        sm="12"
        md="5"
        class="contributeBg"
        data-aos="fade-left"
        data-aos-delay="100"
      >
        <v-card color="secondary" data-aos="fade-left" data-aos-delay="100">
          <v-card-text class="text-h6 defaultFont">
            100% income tax-exempt in India under 35 (i)(iii) of IT Act 1961
          </v-card-text>
        </v-card>
        <v-card
          color="secondary"
          class="my-4"
          data-aos="fade-left"
          data-aos-delay="200"
        >
          <v-card-text class="text-h6 defaultFont">
            Individuals can claim under sec.80 GGA
          </v-card-text>
        </v-card>
        <v-card
          color="secondary"
          class="my-4"
          data-aos="fade-left"
          data-aos-delay="300"
        >
          <v-card-text class="text-h6 defaultFont">
            CSR contributions welcome
          </v-card-text>
        </v-card>
        <!-- <v-card color="secondary" data-aos="fade-left" data-aos-delay="300">
          <v-card-text class="text-h6 defaultFont">
            Those wishing to donate towards Corpus Fund / Endowments kindly
            contact the Institute directly. This link is only for donations
            towards research purposes and related activities.
          </v-card-text>
        </v-card> -->
      </v-col>
    </v-row>
  </v-card>
</template>

<script setup>
const props = defineProps({
  displayContributeButton: { type: Boolean, required: false, default: true },
});
</script>
<style scoped>
.contributeBg {
  background-image: url("/img/icons/donate-background.png");
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
}
</style>
