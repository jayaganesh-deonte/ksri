<template>
  <v-card
    color="transparent"
    elevation="0"
    rounded="0"
    width="100vw"
    :style="`${$device.isMobile ? 'overflow-x: auto' : ''}`"
  >
    <v-timeline
      direction="horizontal"
      line-inset="5"
      hide-opposite
      size="small"
      side="start"
      dot-color="accentGreen"
      class="ma-4"
    >
      <v-timeline-item
        v-for="item in timeLineData"
        :key="item.title"
        color="secondary"
        class="text-center"
        icon="mdi-plus"
        fill-dot
        dot-color="primary"
      >
        <div
          class="text-secondary font-weight-bold"
          :class="`${$device.isMobile ? 'text-h6' : 'text-h5'}`"
        >
          {{ item.title }}
        </div>
        <div
          class="text-primary font-weight-bold animated-number"
          :class="`${$device.isMobile ? 'text-h4' : 'text-h3'}`"
          ref="numberRefs"
        >
          {{ item.currentValue }}
        </div>
      </v-timeline-item>
    </v-timeline>
  </v-card>
</template>

<script setup>
import { ref, onMounted } from "vue";

const timeLineData = ref([
  {
    title: "Sponsors",
    subtitle: 45,
    currentValue: 0,
  },
  {
    title: "Team Members",
    subtitle: 32,
    currentValue: 0,
  },
  {
    title: "Since",
    subtitle: 1945,
    currentValue: 0,
  },
  {
    title: "Contributors",
    subtitle: 2534,
    currentValue: 0,
  },
  {
    title: "Scholars",
    subtitle: 535,
    currentValue: 0,
  },
  {
    title: "Volunteers",
    subtitle: 81,
    currentValue: 0,
  },
]);

const numberRefs = ref([]);

const animateValue = (item, duration = 2000) => {
  const start = item.currentValue;
  const end = item.subtitle;
  const startTime = performance.now();

  const updateNumber = (currentTime) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    // Easing function for smooth animation
    const easeOutQuad = (t) => t * (2 - t);
    const easedProgress = easeOutQuad(progress);

    item.currentValue = Math.floor(start + (end - start) * easedProgress);

    if (progress < 1) {
      requestAnimationFrame(updateNumber);
    }
  };

  requestAnimationFrame(updateNumber);
};

const startAnimations = () => {
  timeLineData.value.forEach((item) => {
    animateValue(item);
  });
};

// Intersection Observer to start animation when elements are visible
onMounted(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          startAnimations();
          observer.disconnect();
        }
      });
    },
    { threshold: 0.1 }
  );

  if (numberRefs.value[0]) {
    observer.observe(numberRefs.value[0]);
  }
});
</script>

<style scoped>
.timeLineBg {
  background-image: url("/img/icons/footer-background-flower.png");
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
}

.animated-number {
  transition: color 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.v-timeline-item {
  animation: fadeIn 0.5s ease-out forwards;
}
</style>
