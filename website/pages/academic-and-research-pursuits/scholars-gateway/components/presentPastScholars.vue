<template>
  <div>
    <!-- for courses -->
    <div v-for="course in courses" :key="course.name">
      <div v-if="hasStudentsForCourse(course)" class="my-8">
        <div class="sectionTitle3 font-weight-bold text-center">
          {{ course.name }}
        </div>
        <div class="text-center">
          <div data-aos="fade-up ">{{ course.subTitle }}</div>
        </div>

        <!-- for supervisors, if students are present for course -->
        <div v-for="supervisor in supervisors" :key="supervisor">
          <!-- if course is M.Phil get mphilStudents and if not get phdStudents -->
          <div v-if="course.name === 'M.Phil'">
            <!-- check if students are present for course and supervisor -->
            <div v-if="mPhilStudentsBySupervisor(supervisor).length > 0">
              <ModernScholarsDetailsCard
                :scholars="mPhilStudentsBySupervisor(supervisor)"
                :supervisorName="supervisor"
              />
            </div>
          </div>

          <div v-else>
            <!-- check if students are present for course and supervisor -->
            <div v-if="phdStudentsBySupervisor(supervisor).length > 0">
              <ModernScholarsDetailsCard
                :scholars="phdStudentsBySupervisor(supervisor)"
                :supervisorName="supervisor"
                class="my-6"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import ModernScholarsDetailsCard from "./ModernScholarsDetailsCard.vue";

const props = defineProps({
  courses: { type: Array, required: true },
  supervisors: { type: Array, required: true },
  mPhilStudentsBySupervisor: { type: Function, required: true },
  phdStudentsBySupervisor: { type: Function, required: true },
  activeCourse: { type: String, required: true, default: "All" },
});

// let activeCourse = ref("All");

const hasStudentsForCourse = (course) => {
  // basedon activeCourse
  if (props.activeCourse != "All") {
    if (props.activeCourse !== course.name) {
      return false;
    }
  }

  // print props
  console.log(props.supervisors);
  // check if students are present for course and supervisor

  if (course.name === "M.Phil") {
    // check if students are present for course and supervisor
    for (let supervisor of props.supervisors) {
      if (props.mPhilStudentsBySupervisor(supervisor).length > 0) {
        return true;
      }
    }
  }

  if (course.name !== "M.Phil") {
    // check if students are present for course and supervisor
    for (let supervisor of props.supervisors) {
      if (props.phdStudentsBySupervisor(supervisor).length > 0) {
        return true;
      }
    }
  }

  return false;
};
</script>
