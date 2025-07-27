<template>
    <div
        class="text-white text-center font-bold p-4 rounded mb-4"
        v-if="login_show_alert"
        :class="login_alert_background"
    >
        {{ login_alert_message }}
    </div>
    <vee-form :validation-schema="loginSchema" @submit="login">
        <!-- Email -->
        <div class="mb-3">
            <label class="inline-block mb-2">{{ $t('login.email') }}</label>
            <vee-field
                name="email"
                type="email"
                class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
                :placeholder="$t('login.email_placeholder')"
            />
            <error-message class="text-red-600" name="email" />
        </div>
        <!-- Password -->
        <div class="mb-3">
            <label class="inline-block mb-2">{{ $t('login.password') }}</label>
            <vee-field
                name="password"
                type="password"
                class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
                :placeholder="$t('login.password')"
            />
            <error-message class="text-red-600" name="password" />
        </div>
        <button
            type="submit"
            class="block w-full bg-purple-600 text-white py-1.5 px-3 rounded transition hover:bg-purple-700"
            :disabled="login_in_submission"
        >
            {{ $t('button.submit') }}
        </button>
    </vee-form>
</template>

<script>
import { mapActions } from 'pinia'
import useUserStore from '@/stores/user'

export default {
    name: 'loginForm',
    data() {
        return {
            loginSchema: {
                email: 'required|max:100|email',
                password: 'required|min:8|max:100',
            },
            login_in_submission: false,
            login_show_alert: false,
            login_alert_background: 'bg-blue-500',
            login_alert_message: this.$t('login.logging_in_progress'),
        }
    },
    methods: {
        ...mapActions(useUserStore, ['authenticate']),
        async login(values) {
            this.login_show_alert = true
            this.login_in_submission = true
            this.login_alert_background = 'bg-blue-500'
            this.login_alert_message = this.$t('login.logging_in_progress')

            try {
                await this.authenticate(values)
            } catch (error) {
                this.login_in_submission = false
                this.login_alert_background = 'bg-red-500'
                this.login_alert_message = error
                return
            }

            this.login_alert_background = 'bg-green-500'
            this.login_alert_message = this.$t('login.logging_completed')

            window.location.reload()
        },
    },
}
</script>
