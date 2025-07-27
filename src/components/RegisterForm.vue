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
            <label class="inline-block mb-2">{{ $t('register.name') }}</label>
            <vee-field
                type="text"
                name="name"
                class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
                :placeholder="$t('register.name_placeholder')"
            />
            <error-message class="text-red-600" name="name" />
        </div>
        <!-- Email -->
        <div class="mb-3">
            <label class="inline-block mb-2">{{ $t('register.email') }}</label>
            <vee-field
                type="email"
                name="email"
                class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
                :placeholder="$t('register.email_placeholder')"
            />
            <error-message class="text-red-600" name="email" />
        </div>
        <!-- Age -->
        <div class="mb-3">
            <label class="inline-block mb-2">{{ $t('register.age') }}</label>
            <vee-field
                type="number"
                name="age"
                class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
                :placeholder="$t('register.age_placeholder')"
            />
            <error-message class="text-red-600" name="age" />
        </div>
        <!-- Password -->
        <div class="mb-3">
            <label class="inline-block mb-2">{{ $t('register.password') }}</label>
            <vee-field name="password" :bails="false" v-slot="{ field, errors }">
                <input
                    class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
                    :placeholder="$t('register.password')"
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
            <label class="inline-block mb-2">{{ $t('register.confirm_password') }}</label>
            <vee-field
                type="password"
                name="confirm_password"
                class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
                :placeholder="$t('register.confirm_password')"
            />
            <error-message class="text-red-600" name="confirm_password" />
        </div>
        <!-- Country -->
        <div class="mb-3">
            <label class="inline-block mb-2">{{ $t('register.country') }}</label>
            <vee-field
                as="select"
                name="country"
                class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
            >
                <option value="USA">{{ $t('country.usa') }}</option>
                <option value="Mexico">{{ $t('country.mexico') }}</option>
                <option value="Germany">{{ $t('country.germany') }}</option>
                <option value="Estonia">{{ $t('country.estonia') }}</option>
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
            <i18n-t class="inline-block" keypath="register.accept" tag="label">
                <a href="#" target="_blank">{{ $t('register.tos') }}</a>
            </i18n-t>
            <error-message class="text-red-600 block" name="tos" />
        </div>
        <button
            type="submit"
            class="block w-full bg-purple-600 text-white py-1.5 px-3 rounded transition hover:bg-purple-700"
            :disabled="register_in_submission"
        >
            {{ $t('button.submit') }}
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
            register_alert_message: this.$t('register.register_in_progress'),
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
            this.register_alert_message = this.$t('register.register_in_progress')

            try {
                await this.createUser(values)
            } catch (error) {
                this.register_in_submission = false
                this.register_alert_background = 'bg-red-500'
                this.register_alert_message = error
                return
            }

            this.register_alert_background = 'bg-green-500'
            this.register_alert_message = this.$t('register.register_completed')

            window.location.reload()
        },
    },
}
</script>
