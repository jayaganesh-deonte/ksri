<template>
  <div>
    <v-card
      color="darkGreen"
      class="d-flex justify-center align-center"
      rounded="0"
      elevation="0"
    >
      <v-card
        color="darkGreen"
        class="d-flex flex-wrap appFooter"
        rounded="0"
        elevation="0"
      >
        <!-- add name and below that all child links -->
        <v-card
          color="transparent"
          v-for="link in footerLinks.links"
          :key="link.name"
          class="d-flex flex-column ma-2 pa-2"
          rounded="0"
          elevation="0"
          data-aos="fade-up"
          :data-aos-delay="`${footerLinks.links.indexOf(link) * 100}`"
          :data-aos-duration="`${footerLinks.links.indexOf(link) * 150}`"
        >
          <div class="text-h6 font-weight-bold text-secondary defaultFont">
            {{ link.name }}
          </div>
          <div v-for="child in link.children" :key="child.name">
            <nuxt-link
              :to="child.path"
              style="text-decoration: unset"
              class="text-subtitle-1 horizontalLineOnHoverAsUnderline"
            >
              {{ child.name }}
            </nuxt-link>
          </div>
        </v-card>
      </v-card>
    </v-card>
    <div class="text-center">
      © {{ currentYear }} The Kuppuswami Sastri Research Institute All Rights
      Reserved.
    </div>
    <div class="">
      <div class="text-center">
        Developed by
        <a
          href="https://deonte.in/"
          target="_blank"
          style="text-decoration: unset"
          >deonte.in</a
        >
      </div>
      <!-- website visitors  count -->
      <div class="text-center" v-if="visitorCount > 0">
        <div>Website Visitors: {{ visitorCount }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import axios from "axios";
const footerLinks = reactive({
  links: [
    {
      name: "Toplinks",
      children: [
        {
          name: "Home",
          path: "/",
        },
        {
          name: "About KSRI",
          path: "/about-ksri",
        },
        {
          name: "Academic & Research",
          path: "/academic-and-research-pursuits",
        },
        {
          name: "Contribute",
          path: "/contribute",
        },
        {
          name: "Gallery",
          path: "/gallery",
        },
        {
          name: "Contact Us",
          path: "/contact-us",
        },
      ],
    },
    {
      name: "About KSRI",
      children: [
        {
          name: "Vision & Mission",
          path: "/about-ksri/vision-and-mission",
        },
        {
          name: "Introduction & Overview",
          path: "/about-ksri",
        },
        {
          name: "Kuppuswami Sastri Profile",
          path: "/about-ksri/kuppuswami-sastri-profile",
        },

        {
          name: "Milestones",
          path: "/about-ksri/milestones",
        },
      ],
    },
    {
      name: "Academic & Research",
      children: [
        {
          name: "Projects & Studies",
          path: "/academic-and-research-pursuits/",
        },
        {
          name: "Scholars Gateway",
          path: "/academic-and-research-pursuits/scholars-gateway",
        },
        {
          name: "KSRI Publications",
          path: "/academic-and-research-pursuits/ksri-publications",
        },
        // {
        //   name: "Research Articles",
        //   path: "/academic-and-research-pursuits/research-articles",
        // },
        {
          name: "Academic Programs",
          path: "/academic-and-research-pursuits/academic-programs",
        },
        {
          name: "KSRI Associates",
          path: "/academic-and-research-pursuits/ksri-associates",
        },
        {
          name: "Seminars/Conferences",
          path: "/academic-and-research-pursuits/seminars-and-conferences",
        },
      ],
    },
    {
      name: "KSRI Team",
      children: [
        {
          name: "Governing Body",
          path: "/ksri-team/",
        },
        {
          name: "Faculty",
          path: "/ksri-team/faculty",
        },
      ],
    },
    {
      name: "Library",
      children: [
        {
          name: "Library In House",
          path: "/library",
        },
        {
          name: "Library On Line",
          path: "/library/library-on-line",
        },
      ],
    },
    {
      name: "Events",
      children: [
        {
          name: "KSRI Events",
          path: "/events",
        },
        {
          name: "KSRI News",
          path: "/events/news",
        },
      ],
    },
    {
      name: "Contribute",
      children: [
        {
          name: "Endowments",
          path: "/contribute/endowments",
        },
        {
          name: "Bank Information",
          path: "/contribute/bank-information",
        },
        {
          name: "By Post",
          path: "/contribute/by-post",
        },
      ],
    },
  ],
});

const currentYear = new Date().getFullYear();

const visitorCount = ref(0);

onMounted(async () => {
  const runtimeConfig = useRuntimeConfig();
  const apiUrl = runtimeConfig.public.API_URL + "/visitorCount";
  try {
    const response = await axios.get(apiUrl);
    console.log("get visitorCount: ", response);
    visitorCount.value = response.data.visitorCount;
  } catch (error) {
    console.error("Error fetching visitor count:", error);
  }
});
</script>
