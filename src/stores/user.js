import { defineStore } from 'pinia'
import { auth, usersCollection } from '@/includes/firebase'
// https://firebase.google.com/docs/reference/js/v8/firebase.auth

export default defineStore('user', {
    state: () => ({
        userLoggedIn: false,
    }),
    actions: {
        async register(values) {
            const userCreds = await auth.createUserWithEmailAndPassword(
                values.email,
                values.password,
            )

            await usersCollection.doc(userCreds.user.uid).set({
                name: values.name,
                email: values.email,
                age: values.age,
                country: values.country,
            })

            await userCreds.user.updateProfile({
                displayName: values.name,
            })

            this.userLoggedIn = true
        },
        async authenticate(values) {
            await auth.signInWithEmailAndPassword(values.email, values.password)

            this.userLoggedIn = true
        },
        async signOut() {
            await auth.signOut()

            this.userLoggedIn = false
        },
    },
})
