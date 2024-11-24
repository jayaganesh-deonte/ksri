<template>
  <v-app id="app">
    <app-bar></app-bar>
    <v-main>
      <slot />
      <div class="socialMediaFooter">
        <Dainandini class="mt-12" />
        <ContactUs class="mt-12" />
        <SocialMediaLinks class="socialMediaFooter" />
      </div>
    </v-main>
    <app-footer></app-footer>
  </v-app>
</template>

<script setup></script>

<style>
.hover-line {
  border: 1px solid black;
  padding: 20px;
  position: relative;
}

.hover-line::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 0;
  background-color: black;
  transition: height 0.5s ease-in-out;
}

.hover-line:hover::before {
  height: 50%;
}

.socialMediaFooter {
  background-image: url("/img/icons/footer-background-flower.png");
  background-repeat: repeat;
  background-size: auto;
}
</style>
