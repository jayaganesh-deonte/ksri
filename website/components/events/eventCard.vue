<template>
  <v-hover>
    <template v-slot:default="{ isHovering, props }">
      <v-card
        class="ma-1"
        height="100%"
        rounded="0"
        :elevation="isHovering ? 5 : 2"
        v-bind="props"
      >
        <v-card
          class="pa-2 ma-2 d-flex flex-column justify-space-between"
          height="100%"
          elevation="0"
          rounded="0"
        >
          <!-- First Row with Two Columns -->
          <v-row>
            <!-- Date Column -->
            <v-col cols="12" sm="3" class="d-flex flex-column">
              <!-- {{ event.avatarImage }} -->

              <v-img
                :src="getAssetUrl(event.avatarImage[0])"
                v-if="event.avatarImage && event.avatarImage.length > 0"
                :alt="event.title"
                class="my-auto"
                aspect-ratio="1"
              />

              <v-img
                v-else
                src="/img/ksri_logo_bw.jpg"
                :alt="event.title"
                aspect-ratio="1"
                class="my-auto"
              />

              <v-card
                :color="isHovering ? 'secondary' : 'secondary lighten-2'"
                class="text-white mt-2 font-weight-bold"
                height="50"
                elevation="0"
                rounded="0"
              >
                <v-card-text class="text-center">
                  <!-- <div class="text-h6">{{ formatDate(event.date)[0] }}</div>
                  <div class="text-h6">{{ formatDate(event.date)[1] }}</div>
                  <div class="text-h6">{{ formatDate(event.date)[2] }}</div> -->
                  <div class="text-body-1 font-weight-bold">
                    {{ formatDate(event.date) }}
                  </div>
                </v-card-text>
              </v-card>
            </v-col>

            <!-- Title and Details Column -->
            <v-col cols="12" sm="9" class="py-2">
              <div
                class="text-h5 text-start pa-0 font-weight-bold"
                :class="isHovering ? 'text-secondary' : 'text-primary'"
              >
                {{ event.title }}
              </div>

              <div
                class="horizontalLineSecondary"
                v-if="isHovering"
                style="--line-width: 15%"
              ></div>
              <div
                class="horizontalLine"
                v-else
                style="--line-width: 15%"
              ></div>

              <div class="text-start pa-0 mt-5">
                <div v-html="event.subtitle"></div>
              </div>
              <v-chip-group class="mt-2">
                <v-chip
                  v-for="(category, index) in event.category"
                  :key="index"
                  color="primary"
                  small
                  class="mr-2"
                >
                  {{ category }}
                </v-chip>
              </v-chip-group>
            </v-col>
          </v-row>

          <!-- Second Row with Read More Button -->
          <div class="my-4 d-flex align-center">
            <div class="mx-1">
              <v-btn
                :color="isHovering ? 'secondary' : 'primary'"
                text
                @click="onReadMore"
                rounded="pill"
                :to="`/events/${event.id}`"
              >
                Read More
              </v-btn>
            </div>

            <div
              class="horizontalLineSecondary mx-4"
              v-if="isHovering"
              style="--line-width: 100%"
            ></div>
            <div
              class="horizontalLine mx-4"
              v-else
              style="--line-width: 100%"
            ></div>
          </div>
        </v-card>
      </v-card>
    </template>
  </v-hover>
</template>

<script>
export default {
  name: "EventCard",
  props: {
    event: {
      type: Object,
      required: true,
    },
  },
  methods: {
    formatDate(dateString) {
      // "2024-10-25"
      const date = new Date(dateString);
      // return 25 Oct 2024
      return date.toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    },
    onReadMore() {
      this.$emit("read-more", this.event);
    },
  },
};
</script>
