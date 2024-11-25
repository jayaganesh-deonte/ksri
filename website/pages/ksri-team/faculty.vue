<template>
  <div class="mx-2">
    <div
      class="heading-with-line text-h4 mb-4 font-weight-bold text-primary text-center"
      data-aos="fade-down"
      data-delay="500"
    >
      Faculty
    </div>

    <div class="d-flex flex-wrap justify-center">
      <div v-for="(item, index) in faculty" :key="index" class="ma-2">
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
          :height="`${$device.isMobile ? '' : '90%'}`"
          data-aos="fade-up"
          data-delay="100"
        >
          <v-row class="ma-2">
            <v-col cols="12" md="4" class="">
              <v-img
                :src="item.displayImage"
                :alt="item.name"
                width="150"
                fit
              ></v-img>
            </v-col>

            <v-col
              cols="12"
              md="8"
              class="d-flex flex-column justify-space-around"
            >
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
            <div class="text-body-1 my-1" v-if="item.mobile">
              <div>Mobile:</div>
              {{ item.mobile }}
            </div>
            <div class="text-body-1 my-1" v-if="item.mail">
              <div>Email:</div>
              {{ item.mail }}
            </div>
          </div>
          <div class="d-flex justify-center mt-2">
            <v-btn
              variant="outlined"
              color="primary"
              rounded="pill"
              @click="downloadProfile(item.profile)"
              >View Profile</v-btn
            >
          </div>
        </v-card>
      </div>
    </div>
  </div>
</template>

<script setup>
const faculty = [
  {
    name: "Dr.V.Kameswari",
    designation: "Former Director",
    displayImage:
      "https://d30y75l38k1y9.cloudfront.net/upload/faculty/dr-v-kameswari.jpg",
    subtitle:
      "Areas of Specialisation: Sahitya, Language and Literature, Scientific literature",
    description: `More than 35 years of teaching and research experience.
Guided many Research Scholars to work on ancient sciences and varied fields of their interest.`,
    mobile: "",
    email: "",
    profile:
      "https://d30y75l38k1y9.cloudfront.net/upload/media/Dr.V.Kameswari CV.docx",
  },
  {
    name: "Dr. K.S.Balasubramanian",
    designation: "Director",
    displayImage:
      "https://d30y75l38k1y9.cloudfront.net/upload/faculty/dr-k-s-balasubramanian.jpg",
    subtitle: "Areas of Specialisation: Yoga, Literature, Philosophy",
    description: `More than 35 years of teaching and research experience.
Guided many Research Scholars to work on Yoga and related fields.`,
    mobile: "9884899716",
    mail: "sanskritkannan@yahoo.com",
    profile:
      "https://d30y75l38k1y9.cloudfront.net/upload/media/Dr.K.S.Balasubramanian.docx",
  },
  {
    name: "Dr. T.V. Vasudeva",
    designation: "Deputy Director",
    displayImage:
      "https://d30y75l38k1y9.cloudfront.net/upload/faculty/dr-t.-v.-vasudeva.jpg",
    subtitle:
      "Areas of Specialisation: Advaita, Vyakarana, Manuscriptology, Dharma Sastra.",
    description: `More than 35 years of teaching and research experience.
Guided many Research Scholars to work on Advaita, Vyakarana and related fields.`,
    mobile: "98846 14473",
    mail: "renudeva@gmail.com",
    profile:
      "https://d30y75l38k1y9.cloudfront.net/upload/media/Dr.T.V.Vasudeva C .V.doc",
  },
  {
    name: "Dr. V. Yamuna Devi",
    designation: "Deputy Director/Associate Professor",
    displayImage:
      "https://d30y75l38k1y9.cloudfront.net/upload/faculty/dr-v-yamuna-devi.jpg",
    subtitle:
      "Areas of Specialisation: Lexicography, Vyakarana, Literature and Dharma Sastra.",
    description: `More than 15 years of teaching and research experience.
Guided many M.Phil. and Ph.D Research Scholars to work on Ancient Indian Mathematics, Advaita and related fields.`,
    mobile: "044-24985320",
    mail: "ksriphd@gmail.com",
    profile:
      "https://d30y75l38k1y9.cloudfront.net/upload/media/Dr.Yamuna C.V July 2024.pdf",
  },
  {
    name: "Dr. P.C. Muralidharan",
    designation: "Assistant Professor",
    displayImage:
      "https://d30y75l38k1y9.cloudfront.net/upload/faculty/murali.jpg",
    subtitle: "Areas of Specialisation: Sahitya, Vaishnavism",
    description: `20 years of teaching and research experience.`,
    mobile: "9840135606",
    mail: "pcmuralidharan1981@gmail.com",
    profile: "",
  },
  {
    name: "Dr. V.Preethi",
    designation: "Associate Professor",
    displayImage:
      "https://d30y75l38k1y9.cloudfront.net/upload/faculty/preethi.jpg",
    subtitle: "Areas of Specialisation: Sahitya, Yoga and Manuscriptology",
    description: `More than 13 years of teaching and research experience.`,
    mobile: "8248630164",
    mail: "preethimahesh.krishnan@gmail.com",
    profile:
      "https://d30y75l38k1y9.cloudfront.net/upload/media/Preethi Resume 5. 8. 24.pdf",
  },
];

const downloadProfile = (profile) => {
  // check if valid url

  if (!profile.startsWith("http://") && !profile.startsWith("https://")) {
    window.open(profile, "_blank");
  }
};
</script>

<style scoped>
.divider {
  height: 2px;
  width: 100%;
  background-color: #abbe88;
}
</style>
