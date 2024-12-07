<template>
  <div class="mx-2">
    <div
      class="heading-with-line text-h4 mb-4 font-weight-bold text-primary text-center"
      data-aos="fade-down"
      data-delay="500"
    >
      Faculty
    </div>

    <div class="d-flex flex-wrap justify-center">
      <div v-for="(item, index) in faculty" :key="index" class="ma-2">
        <div
          class="ma-2 sectionTitle3 text-start"
          data-aos="fade-right"
          data-delay="1000"
        >
          {{ item.designation }}
        </div>
        <v-card
          class="ma-2 pa-2"
          :width="`${$device.isMobile ? '' : '40vw'}`"
          :height="`${$device.isMobile ? '' : '90%'}`"
          data-aos="fade-up"
          data-delay="100"
        >
          <v-row class="ma-2">
            <v-col cols="12" md="4" class="">
              <v-img
                :src="item.displayImage"
                :alt="item.name"
                width="150"
                fit
              ></v-img>
            </v-col>

            <v-col
              cols="12"
              md="8"
              class="d-flex flex-column justify-space-around"
            >
              <div>
                <div class="text-h6 font-weight-bold">
                  {{ item.name }}
                </div>

                <div class="text-h6">
                  {{ item.subtitle }}
                </div>
              </div>
              <div class="divider my-2"></div>

              <div class="text-body-1">
                {{ item.description }}
              </div>
            </v-col>
          </v-row>
          <div
            class="d-flex justify-space-around"
            :class="`${$device.isMobile ? 'flex-column' : 'flex-row'}`"
          >
            <div class="text-body-1 my-1" v-if="item.mobile">
              <div>Mobile:</div>
              {{ item.mobile }}
            </div>
            <div class="text-body-1 my-1" v-if="item.mail">
              <div>Email:</div>
              {{ item.mail }}
            </div>
          </div>
          <div class="d-flex justify-center mt-2">
            <v-btn
              variant="outlined"
              color="primary"
              rounded="pill"
              @click="downloadProfile(item.profile)"
              >View Profile</v-btn
            >
          </div>
        </v-card>
      </div>
    </div>
  </div>
</template>

<script setup>
useSeoMeta({
  title: "Faculty",
  description: "Faculty",
  ogTitle: "Faculty",
  ogDescription: "Faculty",
  twitterTitle: "Faculty",
  twitterDescription: "Faculty",
});

const facultyData = await queryContent("faculty").findOne();
const faculty = facultyData.body;

const downloadProfile = (profile) => {
  // check if valid url

  if (!profile.startsWith("http://") && !profile.startsWith("https://")) {
    window.open(profile, "_blank");
  }
};
</script>

<style scoped>
.divider {
  height: 2px;
  width: 100%;
  background-color: #abbe88;
}
</style>
