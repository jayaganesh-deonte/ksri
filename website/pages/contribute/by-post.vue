<template>
  <div class="">
    <section-title title="Contribute By Post" id="by-post" />
    <div class="text-h6 text-center" data-aos="fade-up" data-aos-delay="100">
      Contributions can also be sent by courier or post by making a cheque or
      demand draft in the name of The Kuppuswami Sastri Research Institute
    </div>

    <div class="d-flex justify-center">
      <v-card
        color="transparent"
        class="mt-5 text-center pa-4"
        elevation="0"
        rounded="0"
        :width="$device.isMobile ? '90vw' : '40vw'"
        data-aos="fade-up"
        data-aos-delay="200"
      >
        <div class="text-h6 font-weight-bold">Send to</div>
        <div class="text-h5 font-weight-bold mb-4">
          The Kuppuswami Sastri Research Institute,
        </div>

        <div class="text-h6 text-secondary font-weight-bold my-2">Address</div>
        <div class="text-h6 my-2">
          84, Thiru vi ka Road, Mylapore, Chennai 600 004.
        </div>

        <div
          class="d-flex justify-space-around my-4"
          :class="`${$device.isMobile ? 'flex-column' : 'flex-row'}`"
        >
          <div class="d-flex justify-space-between align-center">
            <div class="text-secondary font-weight-bold text-h6 mx-4">
              Email
            </div>
            <div class="text-h6">ksrinst@gmail.com</div>
          </div>
          <div class="d-flex justify-space-between align-center">
            <div class="text-secondary font-weight-bold text-h6 mx-4">
              Phone
            </div>
            <div class="text-h6">044-24985320</div>
          </div>
        </div>
      </v-card>
    </div>
    <contributeHeader />
  </div>
</template>

<script setup>
import contributeHeader from "./contributeHeader.vue";
</script>
