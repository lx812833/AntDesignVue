<template>
  <a-input-group compact>
    <a-select v-model="type" style="width: 130px" @change="handleTypeChange">
      <a-select-option value="alipy">支付宝</a-select-option>
      <a-select-option value="bank">银行卡</a-select-option>
    </a-select>
    <a-input v-model="number" style="width: calc(100% - 130px)" @change="handleNumberChange"/>
  </a-input-group>
</template>

<script>
export default {
  props: {
    value: {
      type: Object
    }
  },
  data() {
    const { type, number } = this.value || {}; // 利用对象解构赋值对type、number进行赋值
    return {
      type: type || "alipay",
      number: number || ""
    };
  },
  watch: {
    value(val) {
      Object.assign(this, val); // 深拷贝
    }
  },
  methods: {
    handleTypeChange(val) {
      this.$emit("change", { ...this.value, type: val });
    },
    handleNumberChange(e) {
      this.$emit("change", { ...this.val, number: e.target.value });
    }
  },
};
</script>