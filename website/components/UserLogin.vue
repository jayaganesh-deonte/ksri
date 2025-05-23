<template>
  <div>
    <!-- Desktop Version -->
    <div v-if="!$device.isMobile">
      <nuxt-link
        to="/login"
        style="text-decoration: unset"
        v-if="!getIsAuthenticated"
      >
        <v-btn
          rounded="pill"
          variant="flat"
          color="secondary"
          class="text-white font-weight-bold"
          size="small"
        >
          <v-icon start>mdi-login</v-icon>
          Login
        </v-btn>
      </nuxt-link>

      <!-- display user icon and then signout button on menu -->
      <v-menu v-if="getIsAuthenticated">
        <template v-slot:activator="{ props }">
          <v-btn
            rounded="pill"
            variant="flat"
            color="secondary"
            class="text-white font-weight-bold"
            v-bind="props"
            icon
          >
            <!-- <v-icon start>mdi-account</v-icon> -->
            {{ getFirstLetter(store.user.username) }}
          </v-btn>
        </template>
        <v-list>
          <v-list-item class="text-center">
            <v-list-item-title class="text-body-1 font-weight-bold">
              {{ store.user.username }}
            </v-list-item-title>
          </v-list-item>

          <v-divider></v-divider>

          <v-list-item>
            <nuxt-link to="/user" style="text-decoration: unset">
              <v-card>
                <v-icon start>mdi-account </v-icon>
                Profile
              </v-card>
            </nuxt-link>
          </v-list-item>
          <v-list-item>
            <nuxt-link to="/user/bookshelf" style="text-decoration: unset">
              <v-card>
                <v-icon start>mdi-bookshelf </v-icon>
                Book Shelf
              </v-card>
            </nuxt-link>
          </v-list-item>

          <v-divider></v-divider>
          <v-list-item>
            <v-card @click="signOutMethod()">
              <v-icon start color="error">mdi-logout</v-icon>
              Sign Out
            </v-card>
          </v-list-item>
        </v-list>
      </v-menu>
    </div>

    <!-- Mobile Version -->
    <div v-else>
      <!-- Mobile Login Button -->
      <nuxt-link
        to="/login"
        style="text-decoration: unset"
        v-if="!getIsAuthenticated"
      >
        <div
          icon
          variant="text"
          color="secondary"
          class="text-white d-flex flex-column justify-center align-center"
        >
          <v-icon size="small">mdi-login</v-icon>
          <div class="" style="font-size: 0.6rem">login</div>
        </div>
      </nuxt-link>

      <!-- Mobile User Menu -->
      <v-menu v-if="getIsAuthenticated" location="bottom">
        <template v-slot:activator="{ props }">
          <v-btn
            icon
            variant="text"
            color="secondary"
            class="text-white"
            v-bind="props"
          >
            <v-icon>mdi-account</v-icon>
            <v-badge
              dot
              color="success"
              offset-x="3"
              offset-y="3"
              location="bottom end"
            ></v-badge>
          </v-btn>
        </template>
        <v-list>
          <v-list-item class="text-center">
            <v-list-item-title class="text-body-1 font-weight-bold">
              {{ store.user.username }}
            </v-list-item-title>
          </v-list-item>

          <v-divider></v-divider>

          <v-list-item>
            <nuxt-link to="/user" style="text-decoration: unset; width: 100%">
              <v-card>
                <v-icon start>mdi-account</v-icon>
                Profile
              </v-card>
            </nuxt-link>
          </v-list-item>

          <v-list-item>
            <nuxt-link
              to="/user/bookshelf"
              style="text-decoration: unset; width: 100%"
            >
              <v-card>
                <v-icon start>mdi-bookshelf</v-icon>
                Book Shelf
              </v-card>
            </nuxt-link>
          </v-list-item>

          <v-divider></v-divider>

          <v-list-item @click="signOutMethod()">
            <v-card class="text-error">
              <v-icon start color="error">mdi-logout</v-icon>
              Sign Out
            </v-card>
          </v-list-item>
        </v-list>
      </v-menu>
    </div>
  </div>
</template>

<script setup>
import { userStore } from "~/stores/UserStore";
import { signOut } from "aws-amplify/auth";
import { storeToRefs } from "pinia";

const store = userStore();
const { getIsAuthenticated } = storeToRefs(store);

const signOutMethod = async () => {
  try {
    await signOut();
    store.signOut();
    // navigateTo("/");
  } catch (error) {
    console.error("Error signing out: ", error);
  }
};

const getFirstLetter = (username) => {
  if (username && username.length > 0) {
    return username.charAt(0).toUpperCase();
  }
  return "";
};
</script>

<style scoped>
.v-list-item-title {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* Fix for mobile menu items */
:deep(.v-list-item) a {
  display: flex;
  width: 100%;
}
</style>
