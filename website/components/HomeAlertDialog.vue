<template>
  <!-- create dialog component with transition -->
  <v-dialog
    v-model="dialogModel"
    :width="$device.isMobile ? '' : '40vw'"
    v-if="store.isHomeDialogContentPresent"
    persistent
    content-class="unfold-dialog scroll-dialog"
    transition="unfold-transition"
    scrollable
  >
    <v-card
      class="unfold-content scroll-content"
      :style="`background-color: ${
        store.homeDialogContent.backgroundColor || 'white'
      }`"
    >
      <!-- Decorative scroll top element -->
      <div class="scroll-top-edge"></div>
      <!-- Decorative scroll bottom element -->
      <div class="scroll-bottom-edge"></div>
      <v-card
        color="secondary"
        rounded="0"
        elevation="0"
        :style="`background-color: ${
          store.homeDialogContent.backgroundColor || 'white'
        }`"
      >
        <div class="ma-2 d-flex justify-space-between">
          <span class="text-h5">{{ store.homeDialogContent.title }}</span>
          <v-btn icon="mdi-close" variant="text" @click="closeDialog"></v-btn>
        </div>
      </v-card>
      <v-card-text style="overflow-y: auto; max-height: 60vh">
        <div
          class="sun-editor-editable"
          :style="`background-color: ${
            store.homeDialogContent.backgroundColor || 'white'
          }`"
        >
          <div
            v-html="store.homeDialogContent.description"
            class="sun-editor-editable"
            :style="`background-color: ${
              store.homeDialogContent.backgroundColor || 'white'
            }`"
          />
        </div>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="secondary"
          variant="flat"
          rounded="pill"
          @click="dialogModel = false"
        >
          close
        </v-btn>
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

<style>
@import "https://cdn.jsdelivr.net/npm/suneditor@latest/dist/css/suneditor.min.css";
</style>

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

  // const router = useRouter();

  // router.push(store.homeDialogContent.buttonLink);

  // open url in new window
  const url = store.homeDialogContent.buttonLink;
  window.open(url, "_blank");
};

const closeDialog = async () => {
  // Add a class to play the closing animation
  document.querySelector(".scroll-content")?.classList.add("closing");

  // Wait for animation to complete before actually closing
  setTimeout(async () => {
    dialogModel.value = false;
    await storeHomeDialogVisitedInLocalStorage();
  }, 500);
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

<style scoped>
/* Custom transitions for the dialog */
:deep(.unfold-transition-enter-active),
:deep(.unfold-transition-leave-active) {
  transition: all 0.6s ease-in-out;
}

:deep(.unfold-transition-enter-from) {
  transform: scaleY(0);
  transform-origin: top;
  opacity: 0;
}

:deep(.unfold-transition-leave-to) {
  transform: scaleY(0);
  transform-origin: top;
  opacity: 0;
}

:deep(.unfold-dialog) {
  overflow: hidden;
  perspective: 1000px;
}

:deep(.scroll-dialog) {
  overflow-y: visible !important;
}

.scroll-content {
  position: relative;
  overflow: hidden;
}

.scroll-content.closing .scroll-bottom-edge {
  animation: roll-up-bottom 0.5s ease-in forwards;
}

@keyframes roll-up-bottom {
  0% {
    transform: scaleY(1) translateY(0);
    height: 20px;
  }
  100% {
    transform: scaleY(0) translateY(-10px);
    height: 50px;
  }
}

.scroll-top-edge {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 10px;
  background: linear-gradient(to bottom, rgba(139, 69, 19, 0.6), transparent);
  border-radius: 4px 4px 0 0;
  z-index: 1;
}

.scroll-bottom-edge {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 20px;
  background: linear-gradient(to top, rgba(139, 69, 19, 0.6), transparent);
  border-radius: 0 0 4px 4px;
  z-index: 1;
  animation: unroll-bottom 1s ease-out;
  transform-origin: bottom;
}

:deep(.unfold-content) {
  animation: scroll-unfurl 0.8s ease-out;
  transform-origin: top;
  box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.3);
  border-radius: 0 0 8px 8px;
  position: relative;
  overflow: hidden !important;
}

@keyframes scroll-unfurl {
  0% {
    transform: translateY(-100%) scaleY(0.1);
    opacity: 0.3;
    border-bottom-left-radius: 50%;
    border-bottom-right-radius: 50%;
  }
  20% {
    transform: translateY(-60%) scaleY(0.2);
    opacity: 0.6;
    border-bottom-left-radius: 40%;
    border-bottom-right-radius: 40%;
  }
  40% {
    transform: translateY(-30%) scaleY(0.4);
    opacity: 0.7;
    border-bottom-left-radius: 30%;
    border-bottom-right-radius: 30%;
  }
  60% {
    transform: translateY(-15%) scaleY(0.6);
    opacity: 0.8;
    border-bottom-left-radius: 20%;
    border-bottom-right-radius: 20%;
  }
  80% {
    transform: translateY(-5%) scaleY(0.9);
    opacity: 0.9;
    border-bottom-left-radius: 10%;
    border-bottom-right-radius: 10%;
  }
  100% {
    transform: translateY(0) scaleY(1);
    opacity: 1;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  }
}

@keyframes unroll-bottom {
  0% {
    transform: scaleY(0) translateY(-10px);
    opacity: 0;
    height: 40px;
  }
  50% {
    transform: scaleY(0.5) translateY(-5px);
    height: 30px;
  }
  100% {
    transform: scaleY(1) translateY(0);
    opacity: 1;
    height: 20px;
  }
}
</style>
