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
          data-aos-delay="50"
        >
          <div class="sectionTitle2">Get in touch with us!</div>
          <div class="text-h6">KSRI welcomes guest queries any time!</div>
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
          data-aos-delay="50"
        >
          <div class="sectionTitle2">Send A Message</div>
          <!-- create form -->
          <v-form ref="contactForm">
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
                    :rules="field.rules"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="12" md="12">
                  <v-textarea
                    v-model="formData.message"
                    label="Message"
                    variant="outlined"
                    :rules="[(v) => !!v || 'Message is required']"
                  ></v-textarea>
                </v-col>
              </v-row>
              <v-btn
                color="primary"
                class="text-white"
                rounded="pill"
                @click="submitForm"
                :loading="isSendingMessage"
                :disabled="isSendingMessage"
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
  callUs: "044-24985320 / 044-29505320",
  emailUs: "ksrinst@gmail.com",
  addressLine1: "The Kuppuswami Sastri Research Institute (KSRI)",
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
  "Digitization",
  "Others",
];

const formFields = [
  {
    label: "Name",
    type: "text",
    required: true,
    rules: [(v) => !!v || "Name is required"],
  },
  {
    label: "Email",
    type: "email",
    required: true,
    rules: [
      (v) => !!v || "Email is required",
      (v) => /.+@.+\..+/.test(v) || "Email must be valid",
    ],
  },
  {
    label: "Mobile",
    type: "tel",
    required: true,
    rules: [
      (v) => !!v || "Mobile number is required",
      (v) => (v && v.length === 10) || "Mobile number must be 10 digits",
    ],
  },
];
</script>

<script>
import $toast from "~/utils/toast_notification";

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
      isSendingMessage: false,
    };
  },
  methods: {
    async submitForm() {
      this.isSendingMessage = true;
      // get url from
      const runtimeConfig = useRuntimeConfig();
      const apiEndpoint = runtimeConfig.public.CONTACT_US_URL;

      console.log("apiEndpoint: ", apiEndpoint);

      const { valid } = await this.$refs.contactForm.validate();
      console.log("formValidate: ", valid);
      if (!valid) {
        this.isSendingMessage = false;
        // show message fill all fields
        $toast.error("Please fill all the fields", {
          timeout: 5000,
          position: "top-right",
        });
        return;
      }
      // Handle form submission logic here
      console.log("Form submitted:", this.formData);

      // post message
      const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(this.formData),
      });
      console.log("response: ", response);

      if (response.ok) {
        console.log("Form submitted successfully");
        $toast.success("Thanks for your query. We will get back to you soon.", {
          timeout: 5000,
          position: "top-right",
        });
      } else {
        $toast.error("Something went wrong. Please try again.", {
          timeout: 5000,
          position: "top-right",
        });
      }
      this.isSendingMessage = false;
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
