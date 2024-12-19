<template>
  <div>
    <div class="d-flex flex-row justify-center">
      <div v-for="button in buttons" :key="button">
        <v-btn
          rounded="pill"
          color="primary"
          class="ma-2"
          :variant="activeButton === button ? 'flat' : 'outlined'"
          @click="activeButton = button"
        >
          {{ button }}
        </v-btn>
      </div>
    </div>

    <!-- display present scholars -->
    <div v-if="activeButton === 'Present'">
      <presentPastScholars
        :courses="courses"
        :supervisors="supervisors"
        :mPhilStudentsBySupervisor="mphilStudentsBySupervisor"
        :phdStudentsBySupervisor="phdStudentsBySupervisor"
      />
    </div>

    <!-- display past scholars -->
    <div v-if="activeButton === 'Past'">
      <presentPastScholars
        :courses="courses"
        :supervisors="supervisors"
        :mPhilStudentsBySupervisor="pastMPhilStudentsBySupervisor"
        :phdStudentsBySupervisor="pastPhdStudentsBySupervisor"
      />
    </div>
  </div>
</template>

<script setup>
import presentPastScholars from "./presentPastScholars.vue";

let buttons = ["Present", "Past"];

let activeButton = ref("Present");

const coursesData = await queryContent("courses").findOne();
const courses = coursesData.body;

const supervisorsData = await queryContent("supervisor").findOne();
const supervisors = supervisorsData.body;

const presentStudentsData = await queryContent(
  "students",
  "present",
  "students"
).findOne();

const presentStudents = presentStudentsData.body;

const mphilStudents = computed(() => {
  return presentStudents.filter((student) => student.course === "M.Phil");
});

const mphilStudentsBySupervisor = (supervisor) => {
  return mphilStudents.value.filter(
    (student) => student.supervisor === supervisor
  );
};

const phdStudents = computed(() => {
  return presentStudents.filter((student) => student.course === "Ph.D.");
});

const phdStudentsBySupervisor = (supervisor) => {
  return phdStudents.value.filter(
    (student) => student.supervisor === supervisor
  );
};

// past Phd students
const pastphdstudentsData = await queryContent(
  "students",
  "past",
  "phd"
).findOne();
const pastPhdStudents = pastphdstudentsData.body;

const pastPhdStudentsBySupervisor = (supervisor) => {
  return pastPhdStudents.filter((student) => student.supervisor === supervisor);
};

//  past M.Phil students
const pastMPhilStudentsData = await queryContent(
  "students",
  "past",
  "mphil"
).findOne();

const pastMPhilStudents = pastMPhilStudentsData.body;

const pastMPhilStudentsBySupervisor = (supervisor) => {
  return pastMPhilStudents.filter(
    (student) => student.supervisor === supervisor
  );
};
</script>
