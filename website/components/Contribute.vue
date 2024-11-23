<template>
  <v-card color="primary" rounded="0" elevation="0">
    <v-row align="center" justify="center" class="ma-4">
      <v-col cols="12" sm="12" md="5" class="d-flex flex-column justify-center">
        <div class="text-h4 font-weight-bold defaultFont my-4">CONTRIBUTE</div>
        <div class="text-h6 defaultFont">
          KSRI will be grateful for contributions and sponsorships for its
          corpus and for its many projects. Any donation will go a long way in
          preserving Sanskrit and Indological Studies.
        </div>
        <div class="mt-4">
          <v-btn rounded="pill" color="secondary">Contribute</v-btn>
        </div>
      </v-col>
      <v-col cols="12" sm="12" md="5" class="contributeBg">
        <v-card color="secondary">
          <v-card-text class="text-h6 defaultFont">
            100% income tax-excempt in India under 25 (i)(iii) of IT Act 1961
          </v-card-text>
        </v-card>
        <v-card color="secondary" class="my-4">
          <v-card-text class="text-h6 defaultFont">
            Individuals can claim under sec.80 GGA
          </v-card-text>
        </v-card>
        <v-card color="secondary">
          <v-card-text class="text-h6 defaultFont">
            CSR contributions welcome
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-card>
</template>

<style scoped>
.contributeBg {
  background-image: url("/img/icons/donate-background.png");
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
}
</style>
