<template>
  <div
    class="milestone-container d-flex flex-column align-center"
    ref="milestoneContainer"
  >
    <!-- Year Card -->
    <v-card
      color="secondary"
      width="100"
      height="50"
      class="text-h6 text-center"
      data-aos="fade-down"
      data-aos-delay="100"
    >
      {{ year }}
    </v-card>

    <!-- Vertical Connecting Line -->
    <div class="connector-line">
      <svg width="8" height="80">
        <line
          x1="4"
          y1="0"
          x2="4"
          y2="80"
          stroke="#000000"
          :class="['line', { 'animate-line': isVisible }]"
          stroke-width="3"
        />
      </svg>
    </div>

    <!-- Content Card -->
    <v-card
      :max-width="`${$device.isMobile ? null : '80vw'}`"
      :min-height="`${$device.isMobile ? null : '400'}`"
      class="d-flex flex-column align-center justify-center milestoneCard pa-4"
      data-aos="fade-down"
      data-aos-delay="500"
    >
      <div
        class="font-weight-bold text-center text-secondary ma-2"
        :class="`${$device.isMobile ? 'text-h5' : 'text-h4'}`"
        data-aos="fade-right"
        data-aos-delay="500"
      >
        {{ title }}
      </div>
      <div
        class="text-center"
        :class="`${$device.isMobile ? 'text-body-1' : 'text-h6'}`"
        data-aos="fade-left"
        data-aos-delay="500"
      >
        {{ description }}
      </div>
    </v-card>

    <!-- T-shaped Connecting Line to Next Milestone (if not last) -->
    <div v-if="!isLast" class="t-connector">
      <svg width="100" height="100">
        <!-- Horizontal line -->
        <line
          x1="0"
          y1="0"
          x2="100"
          y2="0"
          stroke="#000000"
          :class="['line', { 'animate-line': isVisible }]"
          stroke-width="3"
        />
        <!-- Vertical line -->
        <line
          x1="50"
          y1="0"
          x2="50"
          y2="100"
          stroke="#000000"
          :class="[
            'line',
            { 'animate-line': isVisible, 'vertical-line': true },
          ]"
          stroke-width="3"
        />
      </svg>
    </div>
  </div>
</template>

<script>
export default {
  name: "MilestoneTile",
  props: {
    year: {
      type: [String, Number],
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    isLast: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isVisible: false,
      observer: null,
    };
  },
  mounted() {
    // Create intersection observer
    this.observer = new IntersectionObserver(this.handleIntersection, {
      threshold: 0.2, // Trigger when 20% of the component is visible
    });

    // Start observing the component
    if (this.$refs.milestoneContainer) {
      this.observer.observe(this.$refs.milestoneContainer);
    }
  },
  beforeDestroy() {
    // Clean up observer
    if (this.observer) {
      this.observer.disconnect();
    }
  },
  methods: {
    handleIntersection(entries) {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          this.isVisible = true;
          // Once visible, stop observing
          this.observer.unobserve(entry.target);
        }
      });
    },
  },
};
</script>

<style scoped>
.milestone-container {
  position: relative;
  width: 100%;
}

.milestoneCard {
  background-image: url("/img/icons/flower-left-img.png"),
    url("/img/icons/flower-right-img.png");
  background-repeat: no-repeat, no-repeat;
  background-size: fit, fit;
  background-position: left top, right top;
}

.connector-line,
.t-connector {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0;
}

.connector-line svg {
  display: block;
}

.line {
  stroke-dasharray: 100;
  stroke-dashoffset: 100;
  transition: stroke-dashoffset 1.5s ease-out;
}

.animate-line {
  stroke-dashoffset: 0;
}

.vertical-line {
  transition-delay: 1s; /* Delay vertical line animation */
}
</style>
