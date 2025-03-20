<template>
  <div>
    <v-carousel
      hide-delimiters
      :style="`${$device.isMobile ? 'height: 100vh' : 'height: 90vh;'}`"
      cycle
      continuous
      interval="8000"
    >
      <template v-for="(item, index) in slideshowData" :key="index">
        <home-carousel-item
          :src="getAssetUrl(item.image[0])"
          :title-text="item.titleText"
          :description-text="item.descriptionText"
          :button-text1="item.buttonText1"
          :button-text2="item.buttonText2"
          :button-text1-route="item.buttonText1Route"
          :button-text2-route="item.buttonText2Route"
        />
      </template>
    </v-carousel>
  </div>
</template>

<script>
export default {
  name: "HomeCarousel",
  data() {
    return {
      button1Color: "white",
      button2Color: "secondary",
      slideshowData: [
        {
          src: "/img/home-slide-bg-1.jpg",
          image: ["home-slide-bg-1.jpg"],
          titleText: "CENTRE FOR SANSKRIT & INDOLOGY RESEARCH",
          descriptionText:
            "Chennai-based private, non-profit organization established in 1945 to conduct world-class research in Sanskrit literature and history, cultures, and religions of India",
          buttonText1: "About KSRI",
          buttonText1Route: "/about-ksri",
          buttonText2: "Get Involved with us",
          buttonText2Route: "/contact-us",
        },
        {
          src: "/img/home-slide-bg-2.jpg",
          image: ["home-slide-bg-2.jpg"],
          titleText: "KSRI LIBRARY In-house & Online",
          descriptionText:
            "The Library is comprised of nearly 65,000 books and 1,500 Palmleaf Manuscripts on variety of Sanskrit and Indological subjects like Dance and Music, Epigraphy, Ethics, Law, Language and Literature, Philosophy and Ayurveda.",
          buttonText1: "Library In-house",
          buttonText2: "Library Online",
          buttonText1Route: "/library",
          buttonText2Route: "/library/library-on-line",
        },
      ],
    };
  },
  methods: {
    changeButtonColorOnHover(buttonNumber) {
      if (buttonNumber === 1) {
        this.button1Color = "primary";
      } else {
        this.button2Color = "primary";
      }
    },
    resetButtonColor(buttonNumber) {
      if (buttonNumber === 1) {
        this.button1Color = "white";
      } else {
        this.button2Color = "secondary";
      }
    },
  },
  async mounted() {
    const slideshowData = await queryContent("slideshow").findOne();
    console.log("slideshowData", slideshowData.body);

    this.slideshowData = slideshowData.body;
  },
};
</script>

<style scoped>
@keyframes lineDrawToRight {
  0% {
    width: 0;
  }
  100% {
    width: 100%;
  }
}
</style>
