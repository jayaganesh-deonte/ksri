<template>
  <div v-if="isAuthorized">
    <!-- TOTP Setup UI -->
    <v-card class="mx-auto my-4" max-width="600">
      <v-card-title class="text-center">TOTP Authentication Setup</v-card-title>

      <v-card-text>
        <v-stepper
          alt-labels
          :items="['Account Setup', 'Generate QR Code', 'Verify Code']"
          :model-value="currentStep"
        >
          <!-- Step 1: Account Setup -->
          <template v-slot:item.1>
            <v-card title="Account Setup" flat class="my-4 pa-4">
              <v-text-field
                v-model="totpAccountName"
                label="Account Name"
                placeholder="Enter a name for this TOTP account"
                variant="outlined"
                :disabled="isConfigured"
              ></v-text-field>

              <v-btn
                color="primary"
                block
                @click="generateTOTP"
                :disabled="!totpAccountName || isConfigured"
                class="mt-4"
              >
                Generate QR Code
              </v-btn>
            </v-card>
          </template>

          <!-- Step 2: QR Code -->
          <template v-slot:item.2>
            <v-card title="Scan QR Code" flat class="my-4 pa-4 text-center">
              <p class="mb-4">Scan this QR code with your authenticator app</p>
              <div class="qr-container d-flex justify-center">
                <div id="qrcode-container" ref="qrCodeContainer"></div>
              </div>
              <p class="mt-4 text-subtitle-1">Secret key: {{ secretKey }}</p>
              <div class="d-flex justify-space-between mt-4">
                <v-btn variant="outlined" @click="currentStep = 1">
                  Back
                </v-btn>
                <v-btn color="primary" @click="advanceToVerify">
                  Continue to verification
                </v-btn>
              </div>
            </v-card>
          </template>

          <!-- Step 3: Verification -->
          <template v-slot:item.3>
            <v-card title="Verify Code" flat class="my-4 pa-4">
              <p>Enter the 6-digit code from your authenticator app:</p>
              <v-text-field
                v-model="verificationCode"
                label="Verification Code"
                placeholder="Enter 6-digit code"
                variant="outlined"
                maxlength="6"
              ></v-text-field>

              <div class="d-flex justify-space-between mt-4">
                <v-btn variant="outlined" @click="currentStep = 2">
                  Back
                </v-btn>
                <v-btn
                  color="primary"
                  @click="verifyTOTP"
                  :disabled="verificationCode.length !== 6"
                >
                  Verify
                </v-btn>
              </div>
            </v-card>
          </template>
        </v-stepper>

        <div v-if="isConfigured" class="text-center mt-4">
          <v-alert type="success">
            TOTP has been successfully configured!
          </v-alert>

          <v-btn color="error" class="mt-4" @click="resetTOTP">
            Reset TOTP Configuration
          </v-btn>
        </div>
      </v-card-text>
    </v-card>
  </div>

  <div v-else>
    <AccessDenied />
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from "vue";
import { useAppStore } from "@/stores/app";
import { TOTP } from "otpauth";
import QRCode from "qrcode";

// Authorization check logic
const isAuthorized = ref(false);
onMounted(() => {
  checkIfCurrentPageIsAuthorized();
});

const checkIfCurrentPageIsAuthorized = () => {
  const appStore = useAppStore();
  const userGroup = appStore.user?.groups || [];
  isAuthorized.value = userGroup.includes("super_admin");
};

// TOTP Setup
const totpAccountName = ref("");
const secretKey = ref("");
const verificationCode = ref("");
const setupPhase = ref("initial"); // initial, qrcode, verify
const qrCodeContainer = ref(null);
const isConfigured = ref(false);
const totpInstance = ref(null);
const currentStep = ref(1); // Track current step for stepper

// Generate TOTP
const generateTOTP = () => {
  if (!totpAccountName.value) return;

  // Generate a random secret key
  const randomBuffer = new Uint8Array(20);
  window.crypto.getRandomValues(randomBuffer);
  const secret = Array.from(randomBuffer)
    .map((byte) => byte % 32)
    .map((index) => "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567".charAt(index))
    .join("");

  secretKey.value = secret;

  // Create TOTP instance with the generated secret
  totpInstance.value = new TOTP({
    issuer: "YourAppName",
    label: totpAccountName.value,
    algorithm: "SHA1",
    digits: 6,
    period: 30,
    secret,
  });

  // Generate the URL for the QR code
  const totpUrl = totpInstance.value.toString();

  // Set the current step and setup phase
  currentStep.value = 2;
  setupPhase.value = "qrcode";

  // Use nextTick to ensure the DOM is updated before trying to render the QR code
  nextTick(() => {
    try {
      // Clear previous QR code if any
      if (qrCodeContainer.value) {
        qrCodeContainer.value.innerHTML = "";
      }

      // Create a new canvas element
      const canvas = document.createElement("canvas");
      canvas.width = 200;
      canvas.height = 200;

      // Append it to the container
      qrCodeContainer.value.appendChild(canvas);

      // Generate QR code
      QRCode.toCanvas(
        canvas,
        totpUrl,
        {
          width: 200,
          margin: 1,
          errorCorrectionLevel: "H",
        },
        (error) => {
          if (error) console.error("Error generating QR code:", error);
        }
      );
    } catch (error) {
      console.error("Error rendering QR code:", error);
    }
  });
};

// Function to advance to verification step
const advanceToVerify = () => {
  currentStep.value = 3;
  setupPhase.value = "verify";
};

// Verify TOTP
const verifyTOTP = async () => {
  if (!totpInstance.value || verificationCode.value.length !== 6) return;

  // Get the current token and compare with user input
  const token = totpInstance.value.generate();
  const isValid = token === verificationCode.value;

  if (isValid) {
    try {
      // Make API call to store the secret (simulated here)
      await saveSecretToAPI({
        accountName: totpAccountName.value,
        secret: secretKey.value,
      });

      isConfigured.value = true;
      setupPhase.value = "initial";
      currentStep.value = 1; // Return to first step after successful configuration
    } catch (error) {
      console.error("Failed to save TOTP secret:", error);
      alert("Failed to save TOTP configuration. Please try again.");
    }
  } else {
    alert("Invalid verification code. Please try again.");
  }
};

// Reset TOTP configuration
const resetTOTP = () => {
  totpAccountName.value = "";
  secretKey.value = "";
  verificationCode.value = "";
  setupPhase.value = "initial";
  isConfigured.value = false;
  totpInstance.value = null;
  currentStep.value = 1;

  // Clear QR code if it exists
  if (qrCodeContainer.value) {
    qrCodeContainer.value.innerHTML = "";
  }
};

// API call (dummy implementation)
const saveSecretToAPI = async (data) => {
  // Simulating an API call
  return new Promise((resolve) => {
    // Mock API delay
    setTimeout(() => {
      console.log("Secret saved to API:", data);
      resolve({ success: true });
    }, 1000);
  });
};
</script>

<style scoped>
.qr-container {
  background-color: white;
  padding: 16px;
  border-radius: 8px;
  display: inline-block;
}

#qrcode-container {
  width: 200px;
  height: 200px;
  background-color: white;
}
</style>
