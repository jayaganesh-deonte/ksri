<template>
  <div class="mx-2" style="background-color: white">
    <section-title title="Endowments" id="endowments" />

    <div
      class="text-center my-8"
      :class="`${$device.isMobile ? 'text-body-1' : 'text-h5'}`"
      data-aos="fade-up"
      data-aos-delay="600"
    >
      KSRI has been fortunate to have many endowments created by well-wishers,
      with specific objectives. KSRI carries out these objectives year after
      year, to honour the pursuits and remembrances of the endowments, from the
      interest income of the endowed amounts.
      <br />
      KSRI invites individuals and organizations to come forward with new
      endowments, help preserve our tradition and culture, as also serve some
      higher purpose of satisfaction to the person creating the endowments.
    </div>

    <div
      class="text-h5 font-weight-bold text-center"
      data-aos="fade-up"
      data-aos-delay="700"
    >
      Following are the list of present endowments and its respective
      objectives:
    </div>
    <div v-for="endowment in endownments" :key="endowment.title">
      <!-- for mobile -->
      <v-card
        v-if="$device.isMobile"
        color="transparent"
        elevation="0"
        class="ma-2 my-6 text-body-1"
        rounded="0"
        data-aos="fade-up"
        :data-aos-delay="`${endownments.indexOf(endowment) * 50}`"
      >
        <div>
          <div
            class="text-secondary"
            data-aos="fade-left"
            :data-aos-delay="`${endownments.indexOf(endowment) * 50}`"
          >
            {{ endowment.title }}
          </div>
          <div
            data-aos="fade-left"
            :data-aos-delay="`${endownments.indexOf(endowment) * 70}`"
          >
            {{ endowment.initiatedBy }}
          </div>
          <div
            class="mt-4"
            data-aos="fade-left"
            :data-aos-delay="`${endownments.indexOf(endowment) * 80}`"
          >
            {{ endowment.topic }}
          </div>
          <div class="bottomLine"></div>
        </div>
      </v-card>
      <!-- for desktop - v-row with 3 cols -->
      <v-row
        v-else
        class="ma-2 my-6 text-body-1 bottomBorder"
        data-aos="fade-left"
        :data-aos-delay="`${endownments.indexOf(endowment) * 50}`"
      >
        <v-col cols="3">
          <div
            class="text-secondary font-weight-bold"
            data-aos="fade-left"
            :data-aos-delay="`${endownments.indexOf(endowment) * 50}`"
          >
            {{ endowment.title }}
          </div>
        </v-col>
        <v-col
          cols="4"
          data-aos="fade-up"
          :data-aos-delay="`${endownments.indexOf(endowment) * 50}`"
        >
          <div>{{ endowment.initiatedBy }}</div>
        </v-col>
        <v-col
          cols="5"
          data-aos="fade-up"
          :data-aos-delay="`${endownments.indexOf(endowment) * 50}`"
        >
          <div>{{ endowment.topic }}</div>
        </v-col>
      </v-row>
    </div>

    <contributeHeader />
  </div>
</template>

<script setup>
import contributeHeader from "./contributeHeader.vue";
const endownmentsData = await queryContent(
  "contribute",
  "endownments"
).findOne();

const endownments = endownmentsData.body;

const scrollTo = () => {
  const endowments = document.getElementById("endowments");
  if (endowments) {
    endowments.scrollIntoView({ behavior: "smooth" });
  }
};

// on mounted scroll to id div with id endowments
onMounted(() => {
  scrollTo();
});

// get active menu option from url
const route = useRoute();

// watch route change scroll to id div with id endowments
watch(
  () => route.fullPath,
  () => {
    console.log(route.fullPath);
    scrollTo();
  }
);
</script>

<style scoped>
.bottomLine {
  background-color: #abbe88;
  width: 100%;
  height: 2px;
}
.bottomBorder {
  border-bottom: 2px solid #abbe88;
}
</style>
