<template>
  <v-carousel-item :src="src" cover class="fade-in">
    <v-card
      color="transparent"
      height="50%"
      class="d-flex flex-column justify-end"
      rounded="0"
      elevation="0"
    >
      <v-card
        rounded="0"
        elevation="0"
        class="d-flex justify-center align-center"
        :class="`${
          $device.isMobile
            ? 'flex-column carouselHeaderMobile'
            : 'flex-row carouselHeaderDesktop'
        }`"
      >
        <div>
          <v-img
            :src="ksriLogo"
            fit
            :width="$device.isMobile ? 130 : 200"
            :class="`${$device.isMobile ? '' : 'ml-auto mr-4'}`"
            @mouseover="changeLogo"
            @mouseleave="changeLogo"
          >
          </v-img>
        </div>
        <div>
          <v-card-item>
            <v-card-text
              class="font-weight-bold defaultFont text-gold text-center"
              :class="`${$device.isMobile ? 'text-h6' : 'text-h4'}`"
            >
              THE KUPPUSWAMI SASTRI RESEARCH INSTITUTE (KSRI)
            </v-card-text>
          </v-card-item>
        </div>
      </v-card>
    </v-card>
    <v-card
      color="transparent"
      height="50%"
      class="d-flex flex-column justify-center align-center text-white text-center"
      rounded="0"
      elevation="0"
    >
      <div style="backdrop-filter: blur(2px)">
        <div
          class="font-weight-bold defaultFont fade-left"
          style="--delay: 0.5s"
          :class="`${$device.isMobile ? 'text-h6' : 'text-h3'}`"
        >
          {{ titleText }}
          <br />
          {{ titleTextLine2 }}
        </div>
        <div
          class="defaultFont pa-4 fade-left"
          style="--delay: 0.8s"
          :class="`${$device.isMobile ? 'text-body-1' : 'text-h5'}`"
        >
          {{ descriptionText }}
          <br v-if="!$device.isMobile" />
          {{ descriptionTextLine2 }}
        </div>
      </div>
      <div
        class="d-flex justify-center align-center fade-left"
        style="--delay: 1s"
        :class="`${$device.isMobile ? 'flex-column ' : 'flex-row'}`"
      >
        <div :class="`${$device.isMobile ? 'mb-2' : 'mr-4'}`">
          <nuxt-link :to="buttonText1Route">
            <v-btn
              width="100%"
              rounded="pill"
              :color="button1Color"
              size="large"
              @mouseover="changeButtonColorOnHover(1)"
              @mouseleave="resetButtonColor(1)"
            >
              {{ buttonText1 }}
            </v-btn>
          </nuxt-link>
        </div>

        <nuxt-link :to="buttonText2Route">
          <v-btn
            width="100%"
            rounded="pill"
            :color="button2Color"
            size="large"
            @mouseover="changeButtonColorOnHover(2)"
            @mouseleave="resetButtonColor(2)"
          >
            {{ buttonText2 }}
          </v-btn>
        </nuxt-link>
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
    buttonText1Route: String,
    buttonText2Route: String,
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
.carouselHeaderDesktop {
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

.carouselHeaderMobile {
  opacity: 0.75;
  /* #09341C with 50% height aligned to center*/
  background-color: transparent;
  background-image: linear-gradient(
    to bottom,
    transparent 50%,
    #09341c 50%,
    #09341c 100%,
    transparent 10%
  );
}
</style>
