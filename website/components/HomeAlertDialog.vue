<template>
  <!-- create dialog component -->
  <v-dialog
    v-model="dialogModel"
    width="auto"
    v-if="store.isHomeDialogContentPresent"
    persistent
  >
    <v-card>
      <v-card color="secondary" rounded="0" elevation="0">
        <div class="ma-2 d-flex justify-space-between">
          <span class="text-h5">{{ store.homeDialogContent.title }}</span>
          <v-btn icon="mdi-close" variant="text" @click="closeDialog"></v-btn>
        </div>
      </v-card>
      <v-card-text>
        <div class="text-h6">{{ store.homeDialogContent.description }}</div>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="primary"
          variant="flat"
          rounded="pill"
          @click="openDialogLink()"
        >
          {{ store.homeDialogContent.buttonText }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
// import store
import { appStore } from "~/stores/AppStore";

const store = appStore();

const dialogModel = ref(false);

const generateHashString = async (str) => {
  // Convert string to buffer
  const msgBuffer = new TextEncoder().encode(str);
  // Generate hash
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
  // Convert buffer to hex string
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return hashHex;
};

const storeHomeDialogVisitedInLocalStorage = async () => {
  //   create hash based on title and description
  const hashString =
    store.homeDialogContent.title + store.homeDialogContent.description;
  const hash = await generateHashString(hashString);
  localStorage.setItem("homeDialogVisited", hash);
  dialogModel.value = false;
};

const checkIfHomeDialogVisitedInLocalStorage = async () => {
  const hashString =
    store.homeDialogContent.title + store.homeDialogContent.description;
  const hash = await generateHashString(hashString);
  const homeDialogVisited = localStorage.getItem("homeDialogVisited");
  return homeDialogVisited === hash;
};

const openDialogLink = () => {
  closeDialog();

  const router = useRouter();

  router.push(store.homeDialogContent.buttonLink);
};

const closeDialog = async () => {
  dialogModel.value = false;
  await storeHomeDialogVisitedInLocalStorage();
};

onMounted(() => {
  // check local storage if dialog is already
  setTimeout(async () => {
    if (store.isHomeDialogContentPresent) {
      // //  display dialog only once
      // const dialogAlreadyDisplayed =
      //   await checkIfHomeDialogVisitedInLocalStorage();
      // if (!dialogAlreadyDisplayed) {
      //   dialogModel.value = true;
      // }

      // display dialog on mount
      dialogModel.value = true;
    }
  }, 1000);
});
</script>
