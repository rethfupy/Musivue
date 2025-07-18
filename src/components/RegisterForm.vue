<template>
    <div
        class="text-white text-center font-bold p-4 rounded mb-4"
        v-if="register_show_alert"
        :class="register_alert_background"
    >
        {{ register_alert_message }}
    </div>
    <vee-form :validation-schema="schema" @submit="register" :initial-values="initValues">
        <!-- Name -->
        <div class="mb-3">
            <label class="inline-block mb-2">Name</label>
            <vee-field
                type="text"
                name="name"
                class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
                placeholder="Enter Name"
            />
            <error-message class="text-red-600" name="name" />
        </div>
        <!-- Email -->
        <div class="mb-3">
            <label class="inline-block mb-2">Email</label>
            <vee-field
                type="email"
                name="email"
                class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
                placeholder="Enter Email"
            />
            <error-message class="text-red-600" name="email" />
        </div>
        <!-- Age -->
        <div class="mb-3">
            <label class="inline-block mb-2">Age</label>
            <vee-field
                type="number"
                name="age"
                class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
                placeholder="Enter Age"
            />
            <error-message class="text-red-600" name="age" />
        </div>
        <!-- Password -->
        <div class="mb-3">
            <label class="inline-block mb-2">Password</label>
            <vee-field name="password" :bails="false" v-slot="{ field, errors }">
                <input
                    class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
                    placeholder="Password"
                    type="password"
                    v-bind="field"
                />
                <div class="text-red-600" v-for="error in errors" :key="error">
                    {{ error }}
                </div>
            </vee-field>
        </div>
        <!-- Confirm Password -->
        <div class="mb-3">
            <label class="inline-block mb-2">Confirm Password</label>
            <vee-field
                type="password"
                name="confirm_password"
                class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
                placeholder="Confirm Password"
            />
            <error-message class="text-red-600" name="confirm_password" />
        </div>
        <!-- Country -->
        <div class="mb-3">
            <label class="inline-block mb-2">Country</label>
            <vee-field
                as="select"
                name="country"
                class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
            >
                <option value="USA">USA</option>
                <option value="Mexico">Mexico</option>
                <option value="Germany">Germany</option>
                <option value="Estonia">Estonia</option>
            </vee-field>
            <error-message class="text-red-600" name="country" />
        </div>
        <!-- TOS -->
        <div class="mb-3 pl-6">
            <vee-field
                type="checkbox"
                name="tos"
                value="1"
                class="w-4 h-4 float-left -ml-6 mt-1 rounded"
            />
            <label class="inline-block">Accept terms of service</label>
            <error-message class="text-red-600 block" name="tos" />
        </div>
        <button
            type="submit"
            class="block w-full bg-purple-600 text-white py-1.5 px-3 rounded transition hover:bg-purple-700"
            :disabled="register_in_submission"
        >
            Submit
        </button>
    </vee-form>
</template>

<script>
import { mapActions } from 'pinia'
import useUserStore from '@/stores/user'

export default {
    name: 'registerForm',
    data() {
        return {
            schema: {
                name: 'required|min:3|max:50|alpha_spaces',
                email: 'required|max:100|email',
                age: 'required|min_value:18|max_value:100',
                password: 'required|min:8|max:100',
                confirm_password: 'passwords_mismatch:@password',
                country: 'required',
                tos: 'tos',
            },
            initValues: {
                country: 'Estonia',
            },
            register_in_submission: false,
            register_show_alert: false,
            register_alert_background: 'bg-blue-500',
            register_alert_message: 'Account is being created.',
        }
    },
    methods: {
        ...mapActions(useUserStore, {
            createUser: 'register',
        }),
        async register(values) {
            this.register_show_alert = true
            this.register_in_submission = true
            this.register_alert_background = 'bg-blue-500'
            this.register_alert_message = 'Account is being created.'

            try {
                await this.createUser(values)
            } catch (error) {
                this.register_in_submission = false
                this.register_alert_background = 'bg-red-500'
                this.register_alert_message = error
                return
            }

            this.register_alert_background = 'bg-green-500'
            this.register_alert_message = 'Success! Your account has been created.'

            window.location.reload()
        },
    },
}
</script>
