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
          <FacultyCard :item="item" />
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

    <div
      class="heading-with-line text-h4 mb-4 font-weight-bold text-primary text-center"
      data-aos="fade-down"
      data-delay="500"
    >
      Non-Academic
    </div>

    <div class="d-flex flex-wrap justify-center">
      <div
        v-for="designationName in nonacademicdesignation"
        :key="designationName"
        class="d-flex"
      >
        <div
          v-for="(item, index) in nonacademicItemsNew[designationName]"
          :key="index"
          class="ma-2"
          :width="`${$device.isMobile ? '' : ''}`"
          :height="`${$device.isMobile ? '' : ''}`"
        >
          <FacultyCard :item="item" />
        </div>
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

const nonacademicData = await queryContent("faculty", "nonacademic").findOne();
let nonacademic = nonacademicData.body;

const nonacademicdesignationData = await queryContent(
  "faculty",
  "nonacademicdesignation"
).findOne();
let nonacademicdesignation = nonacademicdesignationData.body;

const nonacademicItemsNew = {};
// add keys to nonacademicItems based on designation
nonacademicdesignation.forEach((designation) => {
  nonacademicItemsNew[designation] = [];
});
// add nonacademic items to nonacademicItemsNew based on designation
nonacademic.forEach((item) => {
  // if designation is not present in nonacademicItemsNew, add it
  if (!nonacademicItemsNew[item.designation]) {
    nonacademicItemsNew[item.designation] = [];
  }
  nonacademicItemsNew[item.designation].push(item);
});
// sort nonacademic items based on orderId
for (let designationName in nonacademicdesignation) {
  nonacademicItemsNew[nonacademicdesignation[designationName]].sort((a, b) => {
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
