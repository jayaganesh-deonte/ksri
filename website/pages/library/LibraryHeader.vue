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
          :color="button.isHovering ? 'secondary' : 'primary'"
          rounded="pill"
          variant="flat"
          class="ma-2"
          :to="button.path"
          @mouseover="button.isHovering = true"
          @mouseleave="button.isHovering = false"
          v-if="button.name == activeButtonName"
        >
          {{ button.name }}
        </v-btn>
        <v-btn
          color="primary"
          rounded="pill"
          :variant="button.isHovering ? 'flat' : 'outlined'"
          class="ma-2"
          :to="button.path"
          @mouseover="button.isHovering = true"
          @mouseleave="button.isHovering = false"
          v-else
        >
          {{ button.name }}
        </v-btn>
      </div>
    </div>
    <v-divider class="my-6" />
  </div>
</template>

<script setup>
// props to show active button
const props = defineProps({
  activeButtonName: String,
});

const libraryButtons = reactive([
  {
    name: "KSRI Books",
    path: "/library/books",
    isHovering: false,
  },
  {
    name: "KSRI Articles",
    path: "/library/articles",
    isHovering: false,
  },
  {
    name: "KSRI Journals",
    path: "/library/journals",
    isHovering: false,
  },
]);
</script>
