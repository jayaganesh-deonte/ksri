<template>
  <v-carousel-item :src="src" cover class="fade-in">
    <div style="height: 100%; width: 100%">
      <v-card
        color="transparent"
        height="100%"
        class="d-flex flex-column justify-end align-center text-white text-center pb-4"
        rounded="0"
        elevation="0"
      >
        <v-card
          color="rgb(255,255,255,0.5)"
          rounded="0"
          elevation="0"
          class="pa-4"
        >
          <div style="backdrop-filter: blur(2px)" color="">
            <div
              class="font-weight-bold defaultFont text-primary fade-left"
              style="--delay: 0.5s"
              :class="`${$device.isMobile ? 'text-h6' : 'text-h3'}`"
            >
              {{ titleText }}
              <br />
              {{ titleTextLine2 }}
            </div>
            <div
              class="defaultFont pa-4 fade-left text-primary"
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
      </v-card>
    </div>
  </v-carousel-item>
</template>

<script>
export default {
  name: "HomeCarouselItem",
  data() {
    return {
      button1Color: "white",
      button2Color: "primary",
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
