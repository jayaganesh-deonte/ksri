<template>
  <v-carousel-item :src="src" cover class="fade-in" aspect-ratio="1.7">
    <div style="height: 100%; width: 100%">
      <v-card
        color="transparent"
        height="100%"
        class="d-flex flex-column justify-end align-center text-white text-center pb-0"
        rounded="0"
        elevation="0"
        width="100vw"
      >
        <v-card
          color="rgb(203, 179, 117,0.8)"
          rounded="0"
          elevation="0"
          class="pa-4"
          width="80vw"
        >
          <div style="backdrop-filter: blur(2px)" color="">
            <div
              class="font-weight-bold defaultFont text-primary fade-left"
              style="
                --delay: 0.5s;
                text-shadow: -1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff,
                  1px 1px 0 #fff;
              "
              :class="`${$device.isMobile ? 'text-h6' : 'text-h5'}`"
            >
              {{ titleText }}

              {{ titleTextLine2 }}
            </div>
            <div
              class="defaultFont pa-0 ma-0 fade-left text-primary font-weight-bold"
              style="
                --delay: 0.5s;
                text-shadow: -1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff,
                  1px 1px 0 #fff;
              "
              :class="`${$device.isMobile ? 'text-body-1' : 'text-body-1'}`"
            >
              {{ descriptionText }}
              <!-- <br v-if="!$device.isMobile" /> -->
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
                  size="medium"
                  class="pa-2"
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
                size="medium"
                class="pa-2"
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
