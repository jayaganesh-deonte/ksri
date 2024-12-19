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
                :src="item.displayImage[0]"
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
              @click="downloadProfile(item.profile[0])"
              >View Profile</v-btn
            >
          </div>
        </v-card>
      </div>
    </div>

    <div
      class="heading-with-line text-h4 mb-4 font-weight-bold text-primary text-center"
      data-aos="fade-down"
      data-delay="500"
    >
      Chairs
    </div>

    <div class="d-flex flex-wrap justify-center">
      <div v-for="(item, index) in chair" :key="index" class="ma-2">
        <v-card
          class="ma-2 pa-2"
          :width="`${$device.isMobile ? '90vw' : '40vw'}`"
          :height="`${$device.isMobile ? '' : '90%'}`"
          data-aos="fade-up"
          data-delay="100"
        >
          <!-- display chair name and area of specialization in top row -->
          <div
            class="ma-2 d-flex justify-space-between font-weight-bold text-secondary"
          >
            <div>{{ item.chairName }}</div>
            <div>{{ item.areaOfSpecialization }}</div>
          </div>
          <!-- name -->
          <div class="ma-2 d-flex justify-space-between">
            <div class="text-h6 font-weight-bold">
              {{ item.name }}
            </div>
          </div>
          <!-- subtitle -->
          <div class="ma-2 d-flex justify-space-between">
            <div class="">
              {{ item.subTitle }}
            </div>
          </div>
          <!-- divider -->
          <div class="divider my-4"></div>
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

const chairData = await queryContent("chair").findOne();

let chair = chairData.body;

chair = [
  {
    id: "01JFFDAJTZWQ1X2FH7NQ2EGPCJ",
    chairName: "Brahmasri Anna Subramaniam Chair",
    areaOfSpecialization: "Veda-Vedanta Studies",
    name: "Dr. K. Srinivasan",
    subTitle:
      "Former Principal &Head, Dept. of Sanskrit RKM Vivekananda College, Chennai",
    orderId: "1",
  },
  {
    id: "01JFFDA4G6DQSWFDNMARTR43S9",
    chairName: "Dr. B. Madhavan Chair",
    areaOfSpecialization: "Sanskrit Grammar",
    name: "Dr. Muthulakshmi",
    subTitle: "Research Associate, The KSRI",
    orderId: "2",
  },
  {
    id: "01JFFD9Q6X9D8YS8MWE4NBST7F",
    chairName: "Sanātana Dharma Chair",
    areaOfSpecialization: "Ancient Indian Culture",
    name: "Dr. R. Thiagarajan",
    subTitle:
      "Former Prof. & Head, Dept. of Sanskrit, Presidency College, Chennai .",
    orderId: "3",
  },
  {
    id: "01JFFD98TRAXYH3AVY9GW4S7TA",
    chairName: "Dr. S.S. Janaki Chair",
    areaOfSpecialization: "Sahitya and Allied subjects",
    name: "Ms.V. Lalitha",
    subTitle: " ",
    orderId: "4",
  },
  {
    id: "01JFFD8SXA8GS10HD03TWN78R9",
    chairName: "Dr. E.R. Rama Bai Chair",
    areaOfSpecialization: "Sanskrit Literature",
    name: "Dr.Vasumathi Rajaram",
    subTitle: " ",
    orderId: "5",
  },
];

const downloadProfile = (profile) => {
  const link = document.createElement("a");

  link.href = profile;
  link.target = "_blank";
  link.click();
};
</script>

<style scoped>
.divider {
  height: 2px;
  width: 100%;
  background-color: #abbe88;
}
</style>
