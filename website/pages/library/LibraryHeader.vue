<template>
  <div>
    <section-title title="KSRI Library In-house" class="mb-6" />
    <div class="text-h6 my-6" data-aos="fade-up">
      The uniqueness of the Institute's library is that it preserves the
      precious personal collections of great savants such as Dr.S.Radhakrishnan,
      Prof. Hiriyanna, Dr.V.Raghavan and others which are hardly available
      elsewhere.
    </div>
    <div
      class="d-flex justify-center align-center"
      :class="`${$device.isMobile ? ' flex-column ' : 'flex-row'}`"
    >
      <div v-for="button in libraryButtons" :key="button.name">
        <v-btn
          color="primary"
          rounded="pill"
          variant="flat"
          class="ma-2"
          :to="button.path"
          v-if="button.name == activeButtonName"
        >
          {{ button.name }}
        </v-btn>
        <v-hover v-else>
          <template v-slot:default="{ isHovering, props }">
            <v-btn
              v-bind="props"
              :color="isHovering ? 'primary' : 'secondary'"
              rounded="pill"
              :variant="isHovering ? 'flat' : 'flat'"
              class="ma-2"
              :to="button.path"
            >
              {{ button.name }}
            </v-btn>
          </template>
        </v-hover>
      </div>
    </div>
    <v-divider class="my-6" />
  </div>
</template>

<script setup>
// props to show active button
// const props = defineProps({
//   activeButtonName: String,
// });

const libraryButtons = reactive([
  {
    name: "Books",
    path: "/library/books",
    isHovering: false,
  },
  {
    name: "Articles",
    path: "/library/articles",
    isHovering: false,
  },
  {
    name: "Journals",
    path: "/library/journals",
    isHovering: false,
  },
]);

let activeButtonName = ref("Books");

// from route check the activeButtonName
onMounted(() => {
  // from router path check the activeButtonName
  const path = useRoute().path;
  console.log("path", path);

  // set activeButtonName
  libraryButtons.forEach((button) => {
    if (path.includes(button.name.toLowerCase())) {
      activeButtonName.value = button.name;
    }
  });
});
</script>
