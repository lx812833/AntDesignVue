import router from '../../router'
import request from '../../utils/request'

const state = {
    step: {
        payAccount: "123456",
        receiveAccount: {
            type: "支付宝",
            number: ""
        }
    }
};

const actions = {
    async submitStepForm({ commit }, { payload }) {
        console.log("dispatch触发的")
        await request({
            url: "/api/form",
            method: "POST",
            data: payload
        });
        commit("saveStepFormData", { payload })
        router.push("/form/step-form/result")
    }
}

const mutations = {
    saveStepFormData(state, { payload }) {
        console.log("commit触发的")
        state.step = {
            ...state.step,
            ...payload
        }
    }
}

export default {
    namespaced: true,
    state,
    actions,
    mutations
}