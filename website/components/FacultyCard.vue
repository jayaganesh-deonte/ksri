<template>
  <div>
    <div
      class="ma-2 sectionTitle3 text-start"
      data-aos="fade-right"
      data-delay="1000"
    >
      {{ item.designation }}
    </div>
    <v-card
      class="ma-2 pa-2"
      :width="`${$device.isMobile ? '' : '40vw'}`"
      :height="`${$device.isMobile ? '' : '100%'}`"
      data-aos="fade-up"
      data-delay="100"
    >
      <v-row class="ma-2">
        <v-col cols="12" md="4" class="">
          <v-img
            :src="getImageUrl(item.displayImage[0])"
            :alt="item.name"
            width="150"
            fit
          ></v-img>
        </v-col>

        <v-col cols="12" md="8" class="d-flex flex-column justify-space-around">
          <div>
            <div class="text-h6 font-weight-bold">
              {{ item.name }}
            </div>

            <div class="text-h6">
              {{ item.subtitle }}
            </div>
          </div>
          <div class="divider my-2"></div>

          <div class="text-body-1">
            {{ item.description }}
          </div>
        </v-col>
      </v-row>
      <div
        class="d-flex justify-space-around"
        :class="`${$device.isMobile ? 'flex-column' : 'flex-row'}`"
      >
        <!-- <div class="text-body-1 my-1" v-if="item.mobile">
          <div>Mobile:</div>
          {{ item.mobile }}
        </div> -->
        <div class="text-body-1 my-1" v-if="item.mail">
          <div>Email:</div>
          {{ item.mail }}
        </div>
        <v-btn
          variant="outlined"
          color="primary"
          rounded="pill"
          :to="`/ksri-team/faculty/${item.id}`"
          >View Profile</v-btn
        >
      </div>
      <div class="d-flex justify-center mt-2"></div>
    </v-card>
  </div>
</template>

<script setup>
// add props
const { item } = defineProps(["item"]);

const downloadProfile = (profile) => {
  const link = document.createElement("a");

  link.href = profile;
  link.target = "_blank";
  link.click();
};

const getImageUrl = (url) => {
  const runtimeConfig = useRuntimeConfig();
  return runtimeConfig.public.ASSET_DOMAIN + url;
};
</script>
