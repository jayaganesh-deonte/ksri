<!-- src/components/PaymentForm.vue -->

<template>
  <div class="d-flex align-center justify-center">
    <v-card
      class="ma-8"
      elevation="6"
      :width="`${$device.isMobile ? '' : '70%'}`"
    >
      <v-row>
        <!-- show logo in 1st col -->
        <v-col
          cols="12"
          sm="12"
          md="6"
          class="d-flex flex-column text-center align-center"
          v-if="!$device.isMobile"
        >
          <div class="ma-4 pa-4">
            <v-img
              src="/img/ksri_logo_bw.jpg"
              width="300"
              height="300"
              alt="logo"
              class="ma-4 pa-4 mx-auto"
            />
            <div class="pa-4">
              <div class="text-center text-h4 font-weight-bold">
                The Kuppuswami Sastri Research Institute
              </div>
              <div class="text-center text-h6">
                84, Thiru vi ka Road, Mylapore,
              </div>
              <div class="text-center text-h6">
                Chennai 600 004., Tamil Nadu, India
              </div>
            </div>
          </div>
        </v-col>
        <v-col cols="12" sm="12" md="6">
          <v-card class="pa-5" color="#FCFCFC">
            <v-card-title class="text-h5 font-weight-bold">
              Contribute Now
            </v-card-title>
            <v-card-text>
              <v-form ref="donationForm">
                <!-- Donor Type Selection -->
                <div class="form-field">
                  <div class="field-label">
                    Donor Type <span class="required-marker">*</span>
                  </div>
                  <div class="field-input">
                    <v-radio-group v-model="donorType" inline>
                      <v-radio label="Indian Citizen" value="indian"></v-radio>
                      <v-radio label="NRI" value="nri"></v-radio>
                    </v-radio-group>
                  </div>
                </div>

                <!-- Common form fields -->
                <div
                  class="form-field"
                  v-for="field in commonFormFields"
                  :key="field.key"
                >
                  <div class="field-label">
                    {{ field.label }}
                    <span v-if="field.required" class="required-marker">*</span>
                  </div>
                  <div class="field-input">
                    <v-text-field
                      v-if="
                        field.type !== 'textarea' &&
                        field.type !== 'checkbox' &&
                        field.type !== 'date'
                      "
                      density="compact"
                      v-model="orderDetails[field.key]"
                      variant="outlined"
                      :type="field.type || 'text'"
                      :min="field.min"
                      :rules="field.required ? field.rules || requiredRule : []"
                    ></v-text-field>

                    <v-textarea
                      v-else-if="field.type === 'textarea'"
                      density="compact"
                      v-model="orderDetails[field.key]"
                      variant="outlined"
                      :rules="field.required ? field.rules || requiredRule : []"
                      rows="3"
                    ></v-textarea>

                    <v-text-field
                      v-else-if="field.type === 'date'"
                      density="compact"
                      v-model="orderDetails[field.key]"
                      variant="outlined"
                      type="date"
                      :rules="field.required ? field.rules || requiredRule : []"
                    ></v-text-field>
                  </div>
                </div>

                <!-- Indian Citizen ID fields -->
                <div v-if="donorType === 'indian'">
                  <div class="form-field">
                    <div class="field-label">
                      PAN <span class="required-marker">*</span>
                    </div>
                    <div class="field-input">
                      <v-text-field
                        density="compact"
                        v-model="orderDetails.merchant_param1"
                        variant="outlined"
                        placeholder="PAN Number"
                        :rules="panRules"
                      ></v-text-field>
                    </div>
                  </div>

                  <div class="form-field">
                    <div class="field-label">
                      Aadhaar No. <span class="required-marker">*</span>
                    </div>
                    <div class="field-input">
                      <v-text-field
                        density="compact"
                        v-model="orderDetails.merchant_param2"
                        variant="outlined"
                        placeholder="Aadhaar Number"
                        :rules="aadhaarRules"
                      ></v-text-field>
                    </div>
                  </div>
                  <div class="text-caption text-grey mt-n4 mb-4">
                    Either PAN or Aadhaar is mandatory
                  </div>
                </div>

                <!-- NRI ID fields -->
                <div v-if="donorType === 'nri'">
                  <div class="form-field">
                    <div class="field-label">
                      Passport Number <span class="required-marker">*</span>
                    </div>
                    <div class="field-input">
                      <v-text-field
                        density="compact"
                        v-model="orderDetails.merchant_param3"
                        variant="outlined"
                        placeholder="Passport Number"
                        :rules="passportRules"
                      ></v-text-field>
                    </div>
                  </div>

                  <div class="form-field">
                    <div class="field-label">
                      Passport Expiry Date
                      <span class="required-marker">*</span>
                    </div>
                    <div class="field-input">
                      <v-text-field
                        density="compact"
                        v-model="orderDetails.merchant_param4"
                        variant="outlined"
                        type="date"
                        :rules="requiredRule"
                      ></v-text-field>
                    </div>
                  </div>
                </div>

                <!-- checkbox for declaration -->
                <div class="form-field mt-4">
                  <v-checkbox
                    v-model="orderDetails.agree"
                    :rules="[(v) => !!v || 'You must agree to continue!']"
                  >
                    <template v-slot:label>
                      <div>
                        Declaration <span class="required-marker">*</span>:
                        <span v-if="donorType === 'indian'">
                          I am an Indian Citizen, Residing in India.
                        </span>
                        <span v-else>
                          I am Residing Abroad holding valid Indian Passport
                          (Donations to be remitted only in INR).
                        </span>
                      </div>
                    </template>
                  </v-checkbox>
                </div>
              </v-form>

              <v-alert
                text=""
                title="Donations are exempt u/s 35(1)(iii) / 80GGAof Income Tax Act..1961
                vide notification No.102/2007 (F.No 203/68/2004/ ITA-II)"
                type="info"
                variant="tonal"
                class="mt-4"
              ></v-alert>

              <v-divider class="my-4"></v-divider>

              <v-card
                class="d-flex align-center justify-space-between pa-8"
                :class="`${$device.isMobile ? 'flex-column' : 'flex-row'}`"
                color="#F7F7F7"
                elevation="0"
              >
                <!-- add amount text box -->
                <div>
                  <v-card class="pa-4 ma-4" elevation="0" variant="outlined">
                    INR {{ orderDetails.amount }}</v-card
                  >
                </div>
                <div>
                  <v-btn
                    color="primary"
                    class="ma-4"
                    @click="openAlertDialog"
                    v-if="!isLoading"
                  >
                    Pay Now
                  </v-btn>
                  <v-btn color="primary" v-else>
                    <v-progress-circular
                      indeterminate
                      color="primary"
                    ></v-progress-circular>
                  </v-btn>
                </div>
              </v-card>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-card>
    <!-- add dialog box with note -->
    <v-dialog v-model="openDialog" max-width="500" persistent>
      <v-card>
        <v-card-title class="text-h6 font-weight-bold">Note:</v-card-title>
        <v-card-text class="text-h6">
          Those wishing to donate towards Corpus Fund kindly contact the
          Institute directly. This link is only for donations towards research
          purposes and related activities.
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" @click="openDialog = false">Close</v-btn>
          <!-- procced to pay -->
          <v-btn color="secondary" variant="outlined" @click="processPayment"
            >Proceed to Pay</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

export default {
  data() {
    return {
      donorType: "indian", // Default value - indian or nri
      openDialog: false,
      isLoading: false,
      amountRule: [
        (v) => !!v || "Amount is required",
        (v) => v > 0 || "Amount must be greater than 0",
      ],
      requiredRule: [(v) => !!v || "Field is required"],
      emailRule: [
        (v) => !!v || "E-mail is required",
        (v) => /.+@.+\..+/.test(v) || "E-mail must be valid",
      ],
      panRules: [
        (v) =>
          !v || /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(v) || "Invalid PAN format",
        (v) => this.validateIndianID(),
      ],
      aadhaarRules: [
        (v) => !v || /^\d{12}$/.test(v) || "Aadhaar must be 12 digits",
        (v) => this.validateIndianID(),
      ],
      passportRules: [
        (v) => !!v || "Passport number is required",
        (v) =>
          /^[A-Z][0-9]{7}$/.test(v) ||
          "Invalid passport format (e.g., A1234567)",
      ],
      commonFormFields: [
        {
          key: "billing_name",
          label: "Name",
          required: true,
          placeholder: "Name",
        },
        {
          key: "billing_email",
          label: "Email",
          required: true,
          placeholder: "Please enter email",
          rules: this.emailRule,
        },
        {
          key: "billing_tel",
          label: "Mobile Number",
          required: true,
          placeholder: "Please enter mobile number",
        },
        {
          key: "billing_address",
          label: "Address",
          required: true,
          placeholder: "Address",
        },
        {
          key: "billing_city",
          label: "City",
          required: true,
          placeholder: "City",
        },
        {
          key: "billing_state",
          label: "State",
          required: true,
          placeholder: "State",
        },
        {
          key: "billing_zip",
          label: "Pincode",
          required: true,
          placeholder: "Pincode",
        },
        {
          key: "billing_country",
          label: "Country",
          required: true,
          placeholder: "Country",
        },
        {
          key: "amount",
          label: "Amount",
          required: true,
          type: "number",
          min: 1,
          rules: this.amountRule,
          placeholder: "Amount",
        },
      ],
      orderDetails: {
        billing_name: "",
        billing_email: "",
        billing_tel: "",
        billing_address: "",
        billing_city: "",
        billing_state: "",
        billing_zip: "",
        billing_country: "",
        amount: 0,
        currency: "INR",
        language: "EN",
        merchant_param1: "", // PAN Number
        merchant_param2: "", // Aadhaar number
        merchant_param3: "", // Passport number
        merchant_param4: "", // Passport expiry date
        order_id: "",
        agree: false,
      },
    };
  },
  methods: {
    validateIndianID() {
      // For Indian citizens, at least one of PAN or Aadhaar must be provided
      if (this.donorType === "indian") {
        const hasPAN = !!this.orderDetails.merchant_param1;
        const hasAadhaar = !!this.orderDetails.merchant_param2;

        if (!hasPAN && !hasAadhaar) {
          return "Either PAN or Aadhaar is required";
        }
      }
      return true;
    },
    async openAlertDialog() {
      // Validate form
      const { valid } = await this.$refs.donationForm.validate();
      console.log("Form validation result:", valid);

      if (!valid) {
        return;
      }

      // Additional validation for donor type specific fields
      if (this.donorType === "indian") {
        const hasPAN = !!this.orderDetails.merchant_param1;
        const hasAadhaar = !!this.orderDetails.merchant_param2;

        if (!hasPAN && !hasAadhaar) {
          alert("Either PAN or Aadhaar is required for Indian citizens");
          return;
        }
      } else if (this.donorType === "nri") {
        const hasPassport = !!this.orderDetails.merchant_param3;
        const hasExpiry = !!this.orderDetails.merchant_param4;

        if (!hasPassport || !hasExpiry) {
          alert("Both Passport Number and Expiry Date are required for NRIs");
          return;
        }
      }

      this.openDialog = true;
    },
    async processPayment() {
      const runtimeConfig = useRuntimeConfig();
      try {
        // validate the form again to be sure
        const { valid } = await this.$refs.donationForm.validate();
        console.log("Form validation result:", valid);
        if (!valid) {
          return;
        }

        this.isLoading = true;
        const API_URL = runtimeConfig.public.API_URL;

        // Clear irrelevant fields based on donor type
        if (this.donorType === "indian") {
          this.orderDetails.merchant_param3 = "";
          this.orderDetails.merchant_param4 = "";
        } else {
          this.orderDetails.merchant_param1 = "";
          this.orderDetails.merchant_param2 = "";
        }

        // generate uuid for order_id
        this.orderDetails.order_id = uuidv4();

        // init payment by sending order details to the /payments/initiatePayment
        const response = await axios.post(
          `${API_URL}/payments/initiatePayment`,
          this.orderDetails
        );
        console.log("Payment initiated:", response.data);

        // get encryptedUrl from the response
        const paymentUrl = response.data.paymentUrl;
        // Redirect to the payment gateway
        window.location.href = paymentUrl;
        this.isLoading = false;
      } catch (error) {
        this.isLoading = false;
        console.error("Error encrypting order data:", error);
      }
    },
  },
  watch: {
    // Clear values when donor type changes
    donorType(newValue) {
      if (newValue === "indian") {
        this.orderDetails.merchant_param3 = "";
        this.orderDetails.merchant_param4 = "";
      } else {
        this.orderDetails.merchant_param1 = "";
        this.orderDetails.merchant_param2 = "";
      }
    },
  },
};
</script>

<style scoped>
.v-container {
  max-width: 500px;
}
.required-marker {
  color: red;
  margin-left: 2px;
}
.form-field {
  margin-bottom: 16px;
  display: flex;
  flex-direction: column;
}
.field-label {
  font-weight: 500;
  margin-bottom: 4px;
  display: flex;
  align-items: center;
}
.field-input {
  width: 100%;
}
</style>
