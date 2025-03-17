<template>
  <v-card elevation="0" rounded="0" color="primary" class="pa-4">
    <v-row>
      <v-col cols="12" sm="12" md="4" lg="4" data-aos="fade-right">
        <v-list-item>
          <template v-slot:prepend>
            <v-img
              src="/img/icons/newspaper-icon.png"
              width="50"
              height="50"
              fit
            ></v-img>
          </template>
          <div class="text-h4 ml-4 defaultFont">Dainandini</div>
        </v-list-item>
        <audio :src="getAssetUrl(getDainandini.audioFile)" controls></audio>
      </v-col>
      <v-col
        class="text-h6 defaultFont borderLeft pa-4"
        cols="12"
        sm="12"
        md="4"
        lg="8"
        data-aos="fade-left"
      >
        <div>
          {{ getDainandini.sanskritLine1 }}
          <br />
          {{ getDainandini.sanskritLine2 }}
        </div>
        <div>
          {{ getDainandini.description }}
        </div>
      </v-col>
    </v-row>
  </v-card>
</template>

<script setup>
import { appStore } from "~/stores/AppStore";

const store = appStore();

const { getDainandini } = storeToRefs(store);
</script>

<style scoped>
.borderLeft {
  position: relative;
}

.borderLeft::before {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 70%;
  border-left: 2px solid #bf641f;
}
</style>
