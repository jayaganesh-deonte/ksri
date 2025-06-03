import {
    getCurrentUser,
    // signInWithRedirect,
    fetchUserAttributes,
    // fetchAuthSession,

} from "aws-amplify/auth";

// import UserStore

import { userStore } from "~/stores/UserStore"

export default defineNuxtRouteMiddleware(async () => {

    console.log("Global")

    const store = userStore();

    console.log("store")


    if (import.meta.client) {
        try {
            console.log("before getCurrentUser")

            // Create a promise that rejects after timeout
            const timeoutPromise = new Promise((_, reject) => {
                setTimeout(() => reject(new Error("getCurrentUser timed out")), 1000)
            })

            // Race between the actual call and the timeout
            const user = await Promise.race([
                getCurrentUser(),
                timeoutPromise
            ])
            console.log("user", user)
            console.log("after getCurrentUser")

            // fetch user attributes
            const userAttributes = await fetchUserAttributes()
            console.log("userAttributes", userAttributes)

            const userDetails = {
                username: user.username,
                email: userAttributes.email
            }
            store.setUser(userDetails)
            console.log("userDetails", userDetails)
            console.log("email", store.user.email)
            store.userName = user.username
            store.userEmail = userAttributes.email

            await store.checkIfAddressIsAvailable()

        } catch (error) {
            console.error("Error getting current user:", error)

        }
    }

    console.log("after global")

})