<template>
  <v-carousel-item :src="src" cover>
    <v-card
      color="transparent"
      height="50%"
      class="d-flex flex-column justify-end"
    >
      <v-card
        rounded="0"
        elevation="0"
        class="d-flex justify-center align-center carouselHeader"
      >
        <v-col cols="4">
          <v-img
            :src="ksriLogo"
            fit
            width="200"
            class="ml-auto mr-4"
            @mouseover="changeLogo"
            @mouseleave="changeLogo"
          >
          </v-img>
        </v-col>
        <v-col>
          <v-card-item class="text-h4">
            <v-card-text
              class="text-h4 font-weight-bold defaultFont text-gold text-center"
            >
              THE KUPPUSWAMI SASTRI RESEARCH INSTITUTE (KSRI)
            </v-card-text>
          </v-card-item>
        </v-col>
      </v-card>
    </v-card>
    <v-card
      color="transparent"
      height="50%"
      class="d-flex flex-column justify-center align-center text-white text-center"
    >
      <div style="backdrop-filter: blur(2px)">
        <div class="text-h3 font-weight-bold defaultFont">
          {{ titleText }}
          <br />
          {{ titleTextLine2 }}
        </div>
        <div class="text-h5 defaultFont pa-4">
          {{ descriptionText }}
          <br />
          {{ descriptionTextLine2 }}
        </div>
      </div>
      <div>
        <v-btn
          rounded="pill"
          :color="button1Color"
          size="large"
          class="mr-4"
          @mouseover="changeButtonColorOnHover(1)"
          @mouseleave="resetButtonColor(1)"
        >
          {{ buttonText1 }}
        </v-btn>
        <v-btn
          rounded="pill"
          :color="button2Color"
          size="large"
          @mouseover="changeButtonColorOnHover(2)"
          @mouseleave="resetButtonColor(2)"
        >
          {{ buttonText2 }}
        </v-btn>
      </div>
    </v-card>
  </v-carousel-item>
</template>

<script>
export default {
  name: "HomeCarouselItem",
  data() {
    return {
      button1Color: "white",
      button2Color: "secondary",
      logoPrimary: "/img/ksri-logo-primary.png",
      logoSecondary: "/img/ksri-logo-secondary.png",
      ksriLogo: "/img/ksri-logo-primary.png",
    };
  },
  props: {
    src: String,
    titleText: String,
    titleTextLine2: String,
    descriptionText: String,
    descriptionTextLine2: String,
    buttonText1: String,
    buttonText2: String,
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
    changeLogo() {
      if (this.ksriLogo === this.logoPrimary) {
        this.ksriLogo = this.logoSecondary;
      } else {
        this.ksriLogo = this.logoPrimary;
      }
    },
  },
};
</script>

<style scoped>
.carouselHeader {
  opacity: 0.75;
  /* #09341C with 50% height aligned to center*/
  background-color: transparent;
  background-image: linear-gradient(
    to bottom,
    transparent 30%,
    #09341c 30%,
    #09341c 70%,
    transparent 70%
  );
}
</style>
