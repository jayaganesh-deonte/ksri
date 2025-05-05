<template>
  <div>
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
        >
          <v-icon start>mdi-account</v-icon>
          {{ store.user.username }}
        </v-btn>
      </template>
      <v-list>
        <v-list-item>
          <nuxt-link to="/" style="text-decoration: unset">
            <v-card>
              <v-icon start>mdi-bookshelf </v-icon>
              Book Shelf
            </v-card>
          </nuxt-link>
        </v-list-item>
        <v-list-item>
          <v-card @click="signOutMethod()">
            <v-icon start>mdi-logout</v-icon>
            Sign Out
          </v-card>
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>

<script setup>
import { userStore } from "~/stores/UserStore";
import { signOut } from "aws-amplify/auth";

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
</script>
