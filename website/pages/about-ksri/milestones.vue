<template>
  <div>
    <SectionTitle title="Milestones" class="mb-6" />

    <div class="milestones-container mx-2">
      <MilestoneTile
        v-for="(milestone, index) in milestones"
        :key="milestone.year"
        :year="milestone.year"
        :title="milestone.title"
        :description="milestone.description"
        :isLast="index === milestones.length - 1"
        class="milestone-item"
      />
    </div>
  </div>
</template>

<script setup>
// get milestones from content/milestones.json
const milestonesData = await queryContent("milestones").findOne();

const milestones = milestonesData.body;
</script>

<script>
import MilestoneTile from "./MilestoneTile";

export default {
  name: "Milestones",
  components: {
    MilestoneTile,
  },
};
</script>

<style scoped>
.milestone-item {
  width: 100%;
  position: relative;
}
</style>
