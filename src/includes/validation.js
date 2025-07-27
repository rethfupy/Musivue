import {
    Form as VeeForm,
    Field as VeeField,
    defineRule,
    ErrorMessage,
    configure,
} from 'vee-validate'
import {
    required,
    min,
    max,
    alpha_spaces as alphaSpaces,
    email,
    min_value as minValue,
    max_value as maxValue,
    confirmed,
} from '@vee-validate/rules'

import i18n from '@/includes/i18n'
const { t } = i18n.global

export default {
    install(app) {
        app.component('VeeForm', VeeForm)
        app.component('VeeField', VeeField)
        app.component('ErrorMessage', ErrorMessage)

        defineRule('required', required)
        defineRule('tos', required)
        defineRule('min', min)
        defineRule('max', max)
        defineRule('alpha_spaces', alphaSpaces)
        defineRule('email', email)
        defineRule('min_value', minValue)
        defineRule('max_value', maxValue)
        defineRule('passwords_mismatch', confirmed)

        configure({
            generateMessage: (ctx) => {
                const messages = {
                    required: t('validation.required', { field: ctx.field }),
                    min: t('validation.min', { field: ctx.field }),
                    max: t('validation.max', { field: ctx.field }),
                    alpha_spaces: t('validation.alpha_spaces', { field: ctx.field }),
                    email: t('validation.email', { field: ctx.field }),
                    min_value: t('validation.min_value', { field: ctx.field }),
                    max_value: t('validation.max_value', { field: ctx.field }),
                    passwords_mismatch: t('validation.passwords_mismatch'),
                    tos: t('validation.tos'),
                }

                const message = messages[ctx.rule.name]
                    ? messages[ctx.rule.name]
                    : t('validation.invalid', { field: ctx.field })

                return message
            },
            validateOnBlur: true,
            validateOnChange: true,
            validateOnInput: false,
            validateOnModelUpdate: true,
        })
    },
}
