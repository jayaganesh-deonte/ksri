<template>
  <div>
    <v-carousel
      hide-delimiters
      :style="`${$device.isMobile ? 'height: 100vh' : 'height: 90vh;'}`"
      cycle
      continuous
      interval="8000"
    >
      <home-carousel-item
        src="/img/home-slide-bg-1.jpg"
        title-text="CENTRE FOR SANSKRIT"
        title-text-line2="& INDOLOGY RESEARCH"
        description-text="Chennai-based private, non-profit organization established in 1945 to conduct world-class research in Sanskrit"
        description-text-line2=" literature and history, cultures, and religions of India"
        button-text1="About KSRI"
        :button-text1-route="'/about-ksri'"
        button-text2="Get Involved with us"
        :button-text2-route="'/contact-us'"
      />

      <home-carousel-item
        src="/img/home-slide-bg-2.jpg"
        title-text="KSRI LIBRARY"
        title-text-line2="In-house & Online"
        description-text="The Library is comprised of nearly 65,000 books and 1,500 Palmleaf Manuscripts on variety of Sanskrit"
        description-text-line2="and Indological subjects like Dance and Music, Epigraphy, Ethics, Law, Language and Literature, Philosophy and Ayurveda."
        button-text1="Library In-house"
        button-text2="Library Online"
        :button-text1-route="'/library'"
        :button-text2-route="'/library/library-on-line'"
      />
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
