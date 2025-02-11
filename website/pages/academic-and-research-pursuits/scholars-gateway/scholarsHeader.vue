<template>
  <div>
    <section-title title="SCHOLARS GATEWAY" />
    <div data-aos="fade-up" class="sectionBody" data-aos-delay="100">
      KSRI has always been a centre for Research in Sanskrit and Indology. These
      activities are carried out through in-house Scholars and a society of
      associated Scholars. KSRI has associations with renowned doyens in these
      areas, who regularly visit KSRI and are invited frequently for lectures
      and discussion forums.
    </div>
    <!-- <div data-aos="fade-up" class="sectionBody" data-aos-delay="100">
      Much research work is also carried out by doctorial students and project
      investigators to whom KSRI acts as a Scholars Gateway.
    </div>
    <div data-aos="fade-up" class="sectionBody" data-aos-delay="100">
      KSRI has published books and articles based on these research projects; in
      respective chapters, the research work completed, on-going and also
      project ideas are listed. KSRI welcomes any organization interested in
      sponsoring any of the project ideas listed and also individuals who would
      like to pursue such specific projects.
    </div> -->

    <div class="my-8">
      <div class="sectionSubtitle my-4" data-aos="fade-up" data-aos-delay="100">
        Invitation for Project Assistance and Sponsorship
      </div>
      <div data-aos="fade-up" class="sectionBody" data-aos-delay="100">
        KSRI has published books and articles based on various research
        projects. KSRI pursues special projects in its core areas, through
        research scholars, students and independently through its associates.
        There are also project ideas which can be discussed and formalized by
        sponsors and scholars. KSRI welcomes any organization interested in
        sponsoring any of the project ideas listed in the
        <a href="/academic-and-research-pursuits/">Projects & Studies</a>
        section. It invites all interested persons and organizations to join
        with its scholars and pursue the passion.
      </div>
    </div>

    <!-- display sub page buttons -->
    <div
      class="d-flex flex-wrap justify-center align-center"
      :class="`${$device.isMobile ? 'flex-column' : 'flex-row'}`"
    >
      <div v-for="subPage in subPages" :key="subPage">
        <nuxt-link :to="subPage.route">
          <v-btn
            color="primary"
            :variant="activeButton == subPage.title ? 'flat' : 'outlined'"
            class="ma-2"
            rounded="pill"
            style="text-transform: none"
          >
            {{ subPage.title }}</v-btn
          >
        </nuxt-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "scholarsHeader",
};
</script>

<script setup>
const subPages = [
  // Traditional ScholarsModern ScholarsForeign Scholars
  {
    title: "Traditional Scholars",
    route: "/academic-and-research-pursuits/scholars-gateway/",
  },
  {
    title: "Ph.D./M.Phil",
    route: "/academic-and-research-pursuits/scholars-gateway/modern-scholars",
  },
  {
    title: "Foreign Scholars",
    route: "/academic-and-research-pursuits/scholars-gateway/foreign-scholars",
  },
];

let activeButton = ref("Traditional Scholars");

// get active button from route
onMounted(() => {
  const route = useRoute();
  const routepage = route.path.split("/").pop();

  if (routepage == "modern-scholars") {
    activeButton.value = "Ph.D./M.Phil";
  } else if (routepage == "foreign-scholars") {
    activeButton.value = "Foreign Scholars";
  } else {
    activeButton.value = "Traditional Scholars";
  }
});
</script>
