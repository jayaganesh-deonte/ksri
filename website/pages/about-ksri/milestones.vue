<template>
  <div>
    <SectionTitle title="Milestones" class="mb-6" />

    <div class="milestones-container mx-2">
      <MilestoneTile
        v-for="(milestone, index) in milestones"
        :key="milestone.year"
        :year="milestone.year"
        :title="milestone.title"
        :subTitle="milestone.subTitle"
        :description="milestone.description"
        :isLast="index === milestones.length - 1"
        class="milestone-item"
      />
    </div>
  </div>
</template>

<script setup>
useSeoMeta({
  title: "Milestones",
  description: "Milestones of KSRI",
  ogTitle: "Milestones",
  ogDescription: "Milestones of KSRI",
  twitterTitle: "Milestones",
  twitterDescription: "Milestones of KSRI",
});

// get milestones from content/milestones.json
const milestonesData = await queryContent("milestones").findOne();

const milestones = milestonesData.body;

// sort milestones by year in descending order & some year has 1998-89 like this so we need to convert it to 1998, check if - exists
milestones.sort((a, b) => {
  // convert year to number and then sort
  const yearA = a.year.split("-").map((year) => parseInt(year));
  const yearB = b.year.split("-").map((year) => parseInt(year));

  return yearB[0] - yearA[0];
});
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
