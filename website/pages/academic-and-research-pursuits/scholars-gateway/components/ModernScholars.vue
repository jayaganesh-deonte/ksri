<template>
  <div>
    <div
      class="d-flex justify-center align-center mx-2"
      :class="$device.isMobile ? 'flex-wrap' : 'flex-row'"
      v-if="displayFilterBasedOnCourseBtn"
    >
      <div class="text-h6">Course:</div>
      <div v-for="category in filterBasedOnCourseBtn" :key="category">
        <v-btn
          color="primary"
          :variant="activeCourse === category ? 'flat' : 'outlined'"
          rounded="pill"
          class="ma-2"
          @click="activeCourse = category"
          style="text-transform: none"
        >
          {{ category }}
        </v-btn>
      </div>
    </div>

    <div class="d-flex flex-row justify-center" v-if="displayButton">
      <div v-for="button in buttons" :key="button">
        <v-btn
          rounded="pill"
          color="primary"
          class="ma-2"
          :variant="activeButton === button ? 'flat' : 'outlined'"
          @click="activeButton = button"
          style="text-transform: none"
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
        :activeCourse="activeCourse"
      />
    </div>

    <!-- display past scholars -->
    <div v-if="activeButton === 'Past'">
      <presentPastScholars
        :courses="courses"
        :supervisors="supervisors"
        :mPhilStudentsBySupervisor="pastMPhilStudentsBySupervisor"
        :phdStudentsBySupervisor="pastPhdStudentsBySupervisor"
        :activeCourse="activeCourse"
      />
    </div>

    <!-- display All Scholars -->
    <div v-if="activeButton === 'All'">
      <!-- <presentPastScholars
        :courses="courses"
        :supervisors="supervisors"
        :mPhilStudentsBySupervisor="mphilStudentsBySupervisor"
        :phdStudentsBySupervisor="phdStudentsBySupervisor"
        :activeCourse="activeCourse"
      /> -->
      <presentPastScholars
        :courses="courses"
        :supervisors="supervisors"
        :mPhilStudentsBySupervisor="
          (supervisor) => [
            ...mphilStudentsBySupervisor(supervisor),
            ...pastMPhilStudentsBySupervisor(supervisor),
          ]
        "
        :phdStudentsBySupervisor="
          (supervisor) => [
            ...phdStudentsBySupervisor(supervisor),
            ...pastPhdStudentsBySupervisor(supervisor),
          ]
        "
        :activeCourse="activeCourse"
      />
    </div>
  </div>
</template>

<script setup>
// props to show present and past scholars
const props = defineProps({
  present: {
    type: Boolean,
    default: true,
  },
  past: {
    type: Boolean,
    default: true,
  },
  displayFilterBasedOnCourseBtn: {
    type: Boolean,
    required: true,
    default: true,
  },
});

import presentPastScholars from "./presentPastScholars.vue";

let filterBasedOnCourseBtn = ["All", "Ph.D.", "M.Phil"];

let activeCourse = ref("All");

let buttons = ["Present", "Past", "All"];

let activeButton = ref("Present");

let displayButton = computed(() => {
  // return true if both props are true
  return props.present && props.past;
});

// set active button value based on props
// if any prop is false, set active button to other one
if (!props.present) {
  activeButton.value = "Past";
} else if (!props.past) {
  activeButton.value = "Present";
}

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
  return presentStudents.filter((student) => student.course === "M.Phil.");
});

const mphilStudentsBySupervisor = (supervisor) => {
  return mphilStudents.value.filter(
    (student) => student.supervisor === supervisor
  );
};

const phdStudents = computed(() => {
  return presentStudents
    .filter((student) => student.course === "Ph.D.")
    .sort((a, b) => {
      if (!a.startedYear) return 1;
      if (!b.startedYear) return -1;
      return Number(b.startedYear) - Number(a.startedYear);
    });
});

const phdStudentsBySupervisor = (supervisor) => {
  return phdStudents.value
    .filter((student) => student.supervisor === supervisor)
    .sort((a, b) => {
      // Handle empty startedYear values by placing them at the end
      if (!a.startedYear) return 1;
      if (!b.startedYear) return -1;
      return Number(b.startedYear) - Number(a.startedYear);
    });
};

// past Phd students
const pastphdstudentsData = await queryContent(
  "students",
  "past",
  "phd"
).findOne();
const pastPhdStudents = pastphdstudentsData.body;

const pastPhdStudentsBySupervisor = (supervisor) => {
  return pastPhdStudents
    .filter((student) => student.supervisor === supervisor)
    .sort((a, b) => {
      // Handle empty completedYear values by placing them at the end
      if (!a.completedYear) return 1;
      if (!b.completedYear) return -1;
      return Number(b.completedYear) - Number(a.completedYear);
    });
};

//  past M.Phil students
const pastMPhilStudentsData = await queryContent(
  "students",
  "past",
  "mphil"
).findOne();

const pastMPhilStudents = pastMPhilStudentsData.body;

const pastMPhilStudentsBySupervisor = (supervisor) => {
  console.log("pastMPhilStudentsBySupervisor", supervisor);
  console.log("pastMPhilStudents", pastMPhilStudents);
  return pastMPhilStudents
    .filter((student) => student.supervisor === supervisor)
    .sort((a, b) => {
      // Handle empty completedYear values by placing them at the end
      if (!a.completedYear) return 1;
      if (!b.completedYear) return -1;
      return Number(b.completedYear) - Number(a.completedYear);
    });
};
</script>
