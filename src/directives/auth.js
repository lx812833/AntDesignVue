// 利用指令来进行权限校验
import { check } from "../utils/auth"

function install(Vue, options = {}) {
    Vue.directive(options.name || "auth", {
        inserted(el, binding) {
            if (!check(binding.value)) {
                el.parentNode && el.parentNode.removeChild(el)
            }
        }
    })
}

export default { install }