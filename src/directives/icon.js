export default {
    beforeMount(el, binding) {
        let iconClass = `fa fa-${binding.value} text-xl`

        if (binding.arg === 'full') {
            iconClass = binding.value
        }

        if (binding.modifiers.right) {
            iconClass += ' float-right'
        }

        if (binding.modifiers.green) {
            iconClass += ' text-green-400'
        }

        const icon = document.createElement('i')
        icon.className = iconClass

        el.appendChild(icon)
    },
}
