<template>
  <div class="mx-2">
    <v-card>
      <v-row class="ma-2">
        <v-col
          cols="12"
          sm="12"
          md="6"
          class="pa-6"
          data-aos="fade-right"
          data-aos-delay="100"
        >
          <div class="sectionTitle2">Get in touch with us!</div>
          <div class="text-h6">
            KSRI has always welcome our guest query's any time!
          </div>
          <div class="text-h6">
            Feel free to contact us, we are open to discuss any of your queries
            and ideas.
          </div>
          <div>
            <!-- show icon next to the title with bold text and then show the subtitle -->
            <div
              v-for="(contact, index) in contactList"
              :key="index"
              class="ma-2 pa-2"
            >
              <div class="d-flex align-center">
                <!-- <v-icon class="mr-2">{{ contact.icon }}</v-icon> -->
                <v-btn :icon="contact.icon" class="mr-2" color="black"></v-btn>
                <div>
                  <div class="text-h6 font-weight-bold">
                    {{ contact.title }}
                  </div>
                  <div class="text-h6">{{ contact.subtitle }}</div>
                </div>
              </div>
            </div>
          </div>
        </v-col>
        <v-col
          cols="12"
          sm="12"
          md="6"
          class="leftBorder"
          data-aos="fade-left"
          data-aos-delay="100"
        >
          <div class="sectionTitle2">Send A Message</div>
          <!-- create form -->
          <v-form>
            <v-container>
              <v-row>
                <!-- add v-checkbox group for Choose a suitable category -->
                <v-col cols="12" sm="12" md="12">
                  <!-- create check box for messageCategories -->
                  <div class="d-flex flex-wrap">
                    <v-checkbox
                      v-for="(category, index) in messageCategories"
                      :key="index"
                      :label="category"
                      v-model="formData.category"
                      :value="category"
                    ></v-checkbox>
                  </div>
                </v-col>
                <v-col
                  v-for="(field, index) in formFields"
                  :key="index"
                  cols="12"
                  sm="12"
                  md="12"
                >
                  <v-text-field
                    :label="field.label"
                    :type="field.type"
                    variant="outlined"
                    v-model="formData[field.label]"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="12" md="12">
                  <v-textarea
                    v-model="formData.message"
                    label="Message"
                    variant="outlined"
                  ></v-textarea>
                </v-col>
              </v-row>
              <v-btn color="primary" class="text-white" rounded="pill"
                >Submit Message</v-btn
              >
            </v-container>
          </v-form>
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>

<script setup>
const contactDetails = {
  callUs: "044-24985320",
  emailUs: "info@ksri.in ksrinst@gmail.com",
  addressLine1: "Kuppuswami Shastri Research Institute (KSRI)",
  addressLine2:
    "84, Thiru vi ka Road, Mylapore, Chennai 600 004., Tamil Nadu, India",
};
const contactList = [
  {
    icon: "mdi-phone",
    title: "Call Us",
    subtitle: contactDetails.callUs,
  },
  {
    icon: "mdi-email",
    title: "Email Us",
    subtitle: contactDetails.emailUs,
  },
  {
    icon: "mdi-map-marker",
    title: "Address",
    subtitle: contactDetails.addressLine1 + "\n" + contactDetails.addressLine2,
  },
];

const messageCategories = [
  "Donate",
  "Sponsor",
  "Donate Book / Manuscript",
  "Volunteer",
  "Learn Sanskrit",
  "A Visitor",
  "Attend Lectures",
  "Library Membership",
  "Others",
];

const formFields = [
  {
    label: "Name",
    type: "text",
    required: true,
  },
  {
    label: "Email",
    type: "email",
    required: true,
  },
  {
    label: "Mobile",
    type: "tel",
    required: true,
  },
];
</script>

<script>
export default {
  data() {
    return {
      formData: {
        category: [],
        Name: "",
        Email: "",
        Mobile: "",
        message: "",
      },
    };
  },
  methods: {
    submitForm() {
      // Handle form submission logic here
      console.log("Form submitted:", this.formData);
    },
  },
};
</script>

<style scoped>
.leftBorder {
  /*border with opacity*/
  border-left: 1px solid rgba(0, 0, 0, 0.12);
}
</style>
