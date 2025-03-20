<template>
  <v-app id="app">
    <app-bar></app-bar>
    <v-main class="my-0" style="background-color: #c9dfcb">
      <FloatingIcon />
      <v-card elevation="0" rounded="0" color="transparent">
        <slot />
      </v-card>
      <div class="socialMediaFooter">
        <Dainandini class="mt-12" />
        <ContactUs class="mt-12" />
        <SocialMediaLinks class="socialMediaFooter" />
      </div>
    </v-main>
    <app-footer></app-footer>
    <buttonUp />
  </v-app>
</template>

<script setup>
import { appStore } from "~/stores/AppStore";
const store = appStore();

import { getWebInstrumentations, initializeFaro } from "@grafana/faro-web-sdk";
import { TracingInstrumentation } from "@grafana/faro-web-tracing";

const postSessionDetailsToApi = async () => {
  try {
    const userSession = await trackSession();
    console.log("userSession: ", userSession);

    // if isFirstTime then post
    if (!userSession.isFirstTime) {
      return;
    }

    const runtimeConfig = useRuntimeConfig();
    const apiUrl = runtimeConfig.public.API_URL;

    // post session details to api
    const response = await fetch(apiUrl + "/visitorCount", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userSession),
    });
  } catch (e) {
    console.log("error in postSessionDetailsToApi: ", e);
  }
};

const getUniqueUserHash = async () => {
  const useVisitorTracking = await trackVisitor();

  console.log("useVisitorTracking: ", useVisitorTracking);

  if (useVisitorTracking.is_first_time) {
    // post visitor details to api
    const runtimeConfig = useRuntimeConfig();
    const apiUrl = runtimeConfig.public.API_URL;
    const response = await fetch(apiUrl + "/uniqueVisitors", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(useVisitorTracking),
    });
  }
};

onMounted(async () => {
  initializeFaro({
    url: "https://faro-collector-prod-ap-south-1.grafana.net/collect/6d657c7339fbce11beb53cbcc239e65d",
    app: {
      name: "KSRI web",
      version: "1.0.0",
      environment: "production",
    },
    sessionTracking: {
      samplingRate: 1,
      persistent: true,
    },
    instrumentations: [
      // Mandatory, omits default instrumentations otherwise.
      ...getWebInstrumentations(),

      // Tracing package to get end-to-end visibility for HTTP requests.
      new TracingInstrumentation(),
    ],
  });

  // get data from actions
  await store.getAllDataFromApi();

  // post session details to api
  await postSessionDetailsToApi();

  await getUniqueUserHash();
});
</script>

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

.bg {
  background: linear-gradient(
      rgba(255, 255, 255, 0.6),
      rgba(255, 255, 255, 0.6)
    ),
    url("/img/freepik__adjust__65503.png");
  background-repeat: repeat;
  background-size: 600px;
}
</style>
