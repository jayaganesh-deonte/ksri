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
      <div
        v-for="designationName in designation"
        :key="designationName"
        class="d-flex flex-wrap justify-center"
      >
        <div
          v-for="(item, index) in facultyItemsNew[designationName]"
          :key="index"
          class="ma-2"
          :width="`${$device.isMobile ? '' : '40vw'}`"
          :height="`${$device.isMobile ? '' : '90%'}`"
        >
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

const designationData = await queryContent("faculty", "designation").findOne();
let designation = designationData.body;

const facultyData = await queryContent("faculty", "faculty").findOne();
let faculty = facultyData.body;

let facultyItemsNew = {};
// add keys to facultyItems based on designation
designation.forEach((designation) => {
  facultyItemsNew[designation] = [];
});
console.log("facultyItemsNew empty", facultyItemsNew);
// add faculty items to facultyItemsNew based on designation
faculty.forEach((item) => {
  // if designation is not present in facultyItemsNew, add it
  if (!facultyItemsNew[item.designation]) {
    facultyItemsNew[item.designation] = [];
  }
  facultyItemsNew[item.designation].push(item);
});
// sort faculty items based on orderId
for (let designationName in designation) {
  console.log("designationName", designationName);

  facultyItemsNew[designation[designationName]].sort((a, b) => {
    return a.orderId - b.orderId;
  });
}

const chairData = await queryContent("chair").findOne();

let chair = chairData.body;

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
