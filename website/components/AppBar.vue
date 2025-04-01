<template>
  <div v-if="$device.isDesktop">
    <v-card
      id="app-bar"
      color="primary"
      rounded="0"
      elevation="0"
      class="d-flex flex-column"
      style="
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: 1000;
        height: 210px;
      "
    >
      <v-card
        color="primary"
        class="d-flex flex-column justify-end ma-2"
        rounded="0"
        elevation="0"
      >
        <v-card
          rounded="0"
          elevation="0"
          class="d-flex justify-center align-center"
          :class="`${$device.isMobile ? 'flex-column ' : 'flex-row '}`"
          color="primary"
        >
          <div>
            <v-img
              src="/img/ksri-logo-primary.png"
              fit
              :width="$device.isMobile ? 100 : 100"
              :class="`${$device.isMobile ? '' : 'ml-auto mr-4'}`"
            >
            </v-img>
          </div>
          <div>
            <v-card-item class="ma-0 pa-0">
              <v-card-text
                class="font-weight-bold defaultFont text-gold text-center"
              >
                <div
                  class="font-weight-bold pa-0"
                  :class="`${$device.isMobile ? 'text-h6' : 'text-h4'}`"
                >
                  THE KUPPUSWAMI SASTRI RESEARCH INSTITUTE
                </div>
                <div :class="$device.isMobile ? 'text-body-1' : 'text-h6'">
                  (Regd. S.No. 32/1944-45, Dt. 24-2-1945)
                </div>

                <div :class="$device.isMobile ? 'text-body-1' : 'text-h6'">
                  No. 84, Thiru Vi Ka Road, Mylapore, Chennai - 600 004.
                </div>
                <div :class="$device.isMobile ? 'text-body-1' : 'text-body-1'">
                  ksrinst@gmail.com | 044-24985320 / 044-29505320
                </div>
              </v-card-text>
            </v-card-item>
          </div>
        </v-card>
      </v-card>
      <!-- style="position: absolute; right: 0; margin-top: 130px" -->
      <div class="d-flex justify-end align-center mt-n12 mx-8">
        <v-card
          elevation="0"
          rounded="0"
          class="ma-0 pa-0"
          color="transparent"
          width="20vw"
        >
          <search />
        </v-card>
      </div>
      <div class="d-flex mx-auto mt-0">
        <!-- add menu Options -->
        <div v-for="option in menuOptions" :key="option.name">
          <v-card
            :class="{
              activeMenu: option.path === activeMenu.path || option.isActive,
            }"
            rounded="0"
            elevation="0"
            height="65"
            color="transparent"
            class="d-flex justify-center align-center mx-2 pa-2 appBarMenuItem"
            @mouseover="
              option.isActive = true;
              option.showChildren = true;
            "
            @mouseleave="option.isActive = false"
            @click="navigateWithOutChild(option)"
          >
            <div class="ma-2 text-subtitle-1 appBarMenuItem">
              <nuxt-link
                :to="option.path"
                style="text-decoration: unset"
                v-if="!option.children"
              >
                {{ option.name }}
              </nuxt-link>

              <!-- open-on-hover -->
              <v-menu
                v-else
                open-on-click
                open-on-hover
                v-model="option.showChildren"
              >
                <template v-slot:activator="{ props }">
                  <div
                    v-bind="props"
                    class="d-flex align-center justify-center"
                  >
                    {{ option.name }}
                    <v-icon size="x-small" class="mx-1">
                      mdi-arrow-down-drop-circle</v-icon
                    >
                  </div>
                </template>
                <v-card width="95vw">
                  <v-row class="ma-0 pa-0">
                    <v-col
                      v-for="child in option.children"
                      :key="child.name"
                      :cols="12"
                      :md="
                        option.children.length > 3
                          ? 4
                          : 12 / option.children.length
                      "
                    >
                      <nuxt-link
                        :to="child.path"
                        style="text-decoration: unset"
                      >
                        <v-card
                          height="100%"
                          elevation="0"
                          class="ma-1 pa-2 defaultFont d-flex flex-column justify-space-between"
                          :class="{ activeMenuChild: child.isActive === true }"
                          @mouseover="child.isActive = true"
                          @mouseleave="child.isActive = false"
                          color="greenBg"
                        >
                          <div>
                            <div class="d-flex my-2 px-2 align-center">
                              <v-icon size="small" color="primary">
                                mdi-book-open-blank-variant
                              </v-icon>
                              <!-- if active set color -->
                              <div
                                class="px-2 text-h6 defaultFont font-weight-bold"
                                :class="`${
                                  child.isActive ? 'text-white' : 'text-primary'
                                }`"
                              >
                                {{ child.name }}
                              </div>
                            </div>
                            <div class="px-2 text-body-1 defaultFont">
                              {{ child.description }}
                            </div>
                          </div>
                          <!-- <v-divider class="my-2" /> -->
                        </v-card>
                      </nuxt-link>
                    </v-col>
                  </v-row>
                </v-card>
              </v-menu>
            </div>
          </v-card>
        </div>
      </div>
    </v-card>
    <!-- Spacer to prevent content from being hidden behind fixed app bar -->
    <div class="fixed-app-bar-spacer" style="height: 210px"></div>
  </div>
  <span v-else>
    <!-- nav drawer -->

    <v-app-bar
      id="app-bar"
      color="primary"
      height="150"
      scroll-behavior="elevate"
      density="compact"
    >
      <v-card
        width="100vw"
        class="ma-0 pa-1"
        color="primary"
        elevation="0"
        rounded="0"
      >
        <v-row justify="center" align="center">
          <v-col cols="auto">
            <v-img
              src="/img/ksri-logo-primary.png"
              fit
              :width="$device.isMobile ? 60 : 60"
            >
            </v-img>
          </v-col>
          <v-col justify="center" class="text-gold text-center">
            <div class="text-body-1 mb-1">
              THE KUPPUSWAMI SASTRI RESEARCH INSTITUTE
            </div>
            <div
              :class="$device.isMobile ? ' mb-1' : 'text-h6'"
              style="font-size: 0.6rem"
            >
              (Regd. S.No. 32/1944-45, Dt. 24-2-1945)
            </div>

            <div
              :class="$device.isMobile ? '' : 'text-h6'"
              style="font-size: 0.6rem"
            >
              No. 84, Thiru Vi Ka Road, Mylapore, Chennai - 600 004.
            </div>
          </v-col>
        </v-row>
        <v-row class="mt-0 d-flex align-center">
          <v-app-bar-nav-icon
            class="mx-2"
            @click="mobileNavDrawer = !mobileNavDrawer"
          >
            <v-icon>mdi-menu</v-icon>
          </v-app-bar-nav-icon>
          <div class="">
            <v-card
              elevation="0"
              rounded="0"
              class="mx-auto pa-0"
              color="transparent"
              width="70vw"
            >
              <search />
            </v-card>
          </div>
        </v-row>
      </v-card>
    </v-app-bar>
    <v-navigation-drawer v-model="mobileNavDrawer" temporary>
      <v-list nav dense>
        <!-- for each menu option and its children as sub list and show sub list on click and hide other sub list on click of any other menu option-->
        <v-list-item v-for="option in menuOptions" :key="option.name" link>
          <div>
            <div v-if="!option.children">
              <v-list-item class="pl-0" @click.native="navigate(option)">
                <v-list-item-title> {{ option.name }}</v-list-item-title>
                <div class="horizontalLine" v-if="option.showLine"></div>
              </v-list-item>
            </div>
            <div
              v-else
              class="d-flex justify-space-between"
              @click="openChildMenu(option)"
            >
              <v-list-item-title>{{ option.name }}</v-list-item-title>
              <div v-if="option.children">
                <v-icon size="x-small" class="mx-1" v-if="option.showChildren">
                  mdi-arrow-down-drop-circle
                </v-icon>
                <v-icon size="x-small" class="mx-1" v-else>
                  mdi-arrow-right-drop-circle
                </v-icon>
              </div>
            </div>
          </div>
          <!-- add sub list -->
          <div v-if="option.showChildren && option.children">
            <v-list-item
              v-for="child in option.children"
              :key="child.name"
              @click="navigate(child, option)"
            >
              <v-list-item-title>{{ child.name }}</v-list-item-title>
              <div class="horizontalLine" v-if="child.showLine"></div>
            </v-list-item>
          </div>
        </v-list-item>
        <v-divider></v-divider>
      </v-list>
    </v-navigation-drawer>
  </span>
</template>

<script setup>
const menuOptions = reactive([
  {
    name: "Home",
    path: "/",
  },
  {
    name: "About KSRI",
    path: "/about-ksri",
    showChildren: false,
    children: [
      {
        name: "Vision & Mission",
        path: "/about-ksri/vision-and-mission",
        description:
          "At KSRI in pursuit of our stated vision will strive to make the Institute a preferred centre of learning in India for Sanskrit language and related Indology.",
      },
      //  Introduction & Overvie, Kuppuswami Sastri Profile,  Vision & Mission,  Milestones
      {
        name: "Introduction & Overview",
        path: "/about-ksri",
        description:
          "Many research organizations/academic institutions were and are being founded in many parts of our country by exemplary men of vision.",
      },
      {
        name: "Kuppuswami Sastri Profile",
        path: "/about-ksri/kuppuswami-sastri-profile",
        description:
          "MAHAMAHOPADHYAYA, DARSANA KALANIDHI, VIDYAVACASPATI PROFESSOR KUPPUSWAMI SASTRI (1880-1943)",
      },

      {
        name: "Milestones",
        path: "/about-ksri/milestones",
        description:
          "The Silver Jubilee of the Institute was organised on a grand scale with a conference of scholars of Sanskrit and Indology, enaction of Sanskrit Play, release of books etc.",
      },
    ],
  },
  {
    name: "Gallery",
    path: "/gallery",
  },
  {
    name: "Academic & Research",
    path: "/academic-and-research-pursuits",
    showChildren: false,
    children: [
      //  Projects & Studies,  Scholars Gateway,  KSRI Publications, Research Articles, Academic Programs, KSRI Associates, Seminars/Conferences
      {
        name: "Projects & Studies",
        path: "/academic-and-research-pursuits/",
        description:
          "KSRI pursues many projects in Sanskrit scriptures and writings as well as Indology, to pursue its research objectives.",
      },
      {
        name: "Scholars Gateway",
        path: "/academic-and-research-pursuits/scholars-gateway",
        description:
          "The Kuppuswami Sastri Research Institute provides ample opportunities for scholars who are interested in higher studies.",
      },

      // {
      //   name: "Research Articles",
      //   path: "/academic-and-research-pursuits/research-articles",
      //   description: "Research articles on Indology and Sanskrit",
      // },
      {
        name: "Academic Programs",
        path: "/academic-and-research-pursuits/academic-programs",
        description:
          "KSRI has always been a centre for Sanskrit and Indology research.",
      },
      {
        name: "KSRI Associates",
        path: "/academic-and-research-pursuits/ksri-associates",
        description:
          "The KSRI is associated closely with many organizations such as Madras Sanskrit College, Sanskrit Academy, Samskrita Ranga and so on.",
      },
      {
        name: "Seminars/Conferences",
        path: "/academic-and-research-pursuits/seminars-and-conferences",
        description:
          "KSRI has always been a centre for Sanskrit and Indology research. These activities are carried out through in house Scholars and a society of associated Scholars.",
      },
    ],
  },
  {
    name: "KSRI Team",
    path: "/ksri-team",
    showChildren: false,

    children: [
      //  Governing Body, Faculty
      {
        name: "Governing Body",
        path: "/ksri-team/",
      },
      {
        name: "Faculty",
        path: "/ksri-team/faculty",
      },
      {
        name: "Editorial Committee",
        path: "/ksri-team/editorialCommittee",
      },
      {
        name: "Research Committee",
        path: "/ksri-team/researchCommittee",
      },
      {
        name: "Advisory Committee",
        path: "/ksri-team/advisoryCommittee",
      },
    ],
  },

  {
    name: "Publications",
    path: "/ksri-publications",
    description:
      "KSRI has been publishing the Journal of Oriental Research periodically from its inception till date and it is internationally well known.",
  },
  {
    name: "Library",
    path: "/library",
    showChildren: false,
    children: [
      // Library In House    Library On Line
      {
        name: "Library In House",
        path: "/library",
        description:
          "The uniqueness of the Institute's library is that it preserves the precious personal collections of great savants such as Dr.S.Radhakrishnan, Prof. Hiriyanna, Dr.V.Raghavan and others which are hardly available elsewhere.",
      },
      {
        name: "Library On Line",
        path: "/library/library-on-line",
        description:
          "KSRI is in the process of digitizing its treasure of old palm scripts, manuscripts, journals and rare books. KSRI hopes very soon it can offer valuable service by making the stored knowledge available to the world online.",
      },
    ],
  },
  {
    name: "Events",
    path: "/events",
    showChildren: false,
    children: [
      //  Upcoming Events,  Past Events
      {
        name: "KSRI Events",
        path: "/events",
        description:
          "KSRI regularly conducts events and forums at its premises. All endowment events are also conducted in its premises. All are welcome to these programs.",
      },
      {
        name: "KSRI News",
        path: "/events/news",
        description: "KSRI latest news & announcement, articles",
      },
    ],
  },
  {
    name: "Contribute",
    path: "/contribute",
    showChildren: false,
    children: [
      //  Endowments, Bank Information,  By Post

      {
        name: "Contribute Now",
        path: "/payment/donation/",
        // description: "Contribute Now",
      },
      {
        name: "Endowments",
        path: "/contribute/endowments",
        description:
          "Create an endowment to perpetuate the memory of your dear ones to hold a lecture annually in their names...",
      },
      // {
      //   name: "Bank Information",
      //   path: "/contribute/bank-information",
      //   description: "List of Local/Foriegn contribution the bank particulars",
      // },
      // {
      //   name: "By Post",
      //   path: "/contribute/by-post",
      //   description:
      //     "Contributions can also be sent by courier or post by making a cheque or demand draft in the name of The Kuppuswami Sastri Research Institute",
      // },
    ],
  },
]);

// get active menu option from url
const route = useRoute();

console.log(route.path);

let activeMenu = reactive({
  name: "home",
  path: "/",
});

const setActiveMenu = () => {
  menuOptions.forEach((option) => {
    if (route.path.includes(option.path)) {
      Object.assign(activeMenu, option);
      return;
    }
  });
};

const navigate = (option, parent) => {
  // showLine
  option.showLine = true;

  //
  setTimeout(() => {
    option.showLine = false;

    // if parent
    if (parent) {
      parent.showChildren = false;
    }

    const router = useRouter();

    router.push(option.path);
  }, 400);
};

const navigateWithOutChild = (option) => {
  // if child doesnt exist, then navigate
  if (!option.children) {
    navigate(option);
  }
};

setActiveMenu();

// watch route change
watch(
  () => route.path,
  () => {
    setActiveMenu();
  }
);

// mobile nav bar toggle
let mobileNavDrawer = ref(false);

const openChildMenu = (option) => {
  option.showChildren = !option.showChildren;
  // for all menu options hide children
  menuOptions.forEach((opt) => {
    if (opt !== option) {
      opt.showChildren = false;
    }
  });
};
</script>

<style scoped>
/* active menu option */
.activeMenuChild {
  background-color: #bf641f !important;
  color: white !important;
}
</style>
