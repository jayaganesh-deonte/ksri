import {
    getCurrentUser,
    signInWithRedirect,
    fetchUserAttributes,
    fetchAuthSession,
} from "aws-amplify/auth";

// import UserStore

import { userStore } from "~/stores/UserStore"

export default defineNuxtRouteMiddleware(async () => {

    console.log("Authenticated Middleware")

    const store = userStore();


    try {
        const user = await getCurrentUser()
        console.log("User:", user)
        store.setUser(user)

    } catch (error) {
        console.error("Error getting current user:", error)
        signInWithRedirect()
    }
    console.log("after get user")
})