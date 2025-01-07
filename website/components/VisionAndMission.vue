<template>
  <div class="text-center">
    <div class="sectionTitle" data-aos="zoom-in">VISION & MISSION</div>

    <!-- add two cards for vision and mission -->
    <v-row class="ma-2">
      <v-col
        cols="12"
        sm="12"
        md="6"
        data-aos="fade-right"
        data-aos-delay="100"
      >
        <v-card height="100%">
          <div class="d-flex justify-center">
            <v-img src="/img/icons/vision.png" fit></v-img>
          </div>
          <div :class="`${$device.isMobile ? '' : 'mx-4'}`">
            <div class="visionMissionTitle">VISION STATEMENT</div>

            <div class="text-h5 text-primary font-weight-bold defaultFont">
              We at KSRI
            </div>
            <div class="sectionTitle">"PRESERVE"</div>
            <div class="text-h6 vissionText">
              the knowledge of Sanskrit and related Indology
            </div>

            <div class="text-start ma-4 pa-4 text-h6 vissionText">
              <div>
                <span class="highlightColor">Preserve </span>
                - in true sense of establishing - the vast heritage, wisdom and
                culture that the knowledge of Sanskrit and related Indology
                delivers to humanity;
              </div>
              <div class="my-6">
                <span class="highlightColor">Preserve </span> - in True sense of
                institutionalizing - to ensure that the sphere of Sanskrit and
                Indology knowledge gets stronger and more enterenched with every
                passing day;
              </div>
              <div>
                <span class="highlightColor">Preserve </span> - in true sense of
                perpetuity - to pass on to future generations a robust, sound,
                modern and likeable knowledge base of Sanskrit and Indology; and
                enjoyable communication of the same;
              </div>
              <div class="my-6">
                <span class="highlightColor">Preserve </span> - in true sense of
                consolidation - to make the world Sanskrit society larger.
              </div>
            </div>
          </div>
        </v-card>
      </v-col>

      <v-col cols="12" sm="12" md="6" data-aos="fade-left" data-aos-delay="100">
        <v-card height="100%">
          <div class="d-flex justify-center">
            <v-img src="/img/icons/mission.png" fit></v-img>
          </div>
          <div :class="`${$device.isMobile ? '' : 'mx-4'}`">
            <div class="visionMissionTitle">MISSION STATEMENT</div>

            <div class="text-h5 text-primary font-weight-bold defaultFont">
              We at KSRI
            </div>
            <div class="text-secondary text-h6 defaultFont mx-4">
              in pursuit of our stated vision will strive to make the Institute
              a preferred centre of learning in India for Sanskrit language and
              related Indology.
            </div>
            <div class="text-h6 vissionText">
              We will strive to achieve this mission by being a competent centre
              for actively pursuing, promoting and facilitating in Sanskrit
              language and related Indology.
            </div>

            <div class="text-start ma-4 pa-4 text-body-1 vissionText">
              <v-list-item
                v-for="missionPoint in missionPoints"
                :key="missionPoint"
              >
                <template v-slot:prepend>
                  <v-icon color="secondary">mdi-star</v-icon>
                </template>
                <div class="font-weight-bold text-primary text-h6 defaultFont">
                  {{ missionPoint }}
                </div>
              </v-list-item>
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
const missionPoints = [
  "Original research",
  "Propagation",
  "Publications and modern communication",
  "Scholars gateway",
  "Library and collection of precious manuscripts; encourage continuous and greater usage of the same",
  "Teaching and Doctorate program support",
  "Affiliations",
];
</script>

<style scoped>
.highlightColor {
  color: #bf641f;
  font-weight: bold;
}

.vissionText {
  font-family: "Times New Roman", sans-serif;
}
</style>
