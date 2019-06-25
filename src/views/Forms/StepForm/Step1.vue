<template>
  <div>
    <a-form layout="horizontal" :form="form">
      <a-form-item label="付款账户" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol">
        <a-input
          v-decorator="[
            'payAccount',
            {
              initialValue: step.payAccount,
              rules: [{ required: true, message: '请输入付款账号' }]
            }
          ]"
          placeholder="请输入付款账号"
        />
      </a-form-item>
      <a-form-item label="收款账户" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol">
        <ReceiveAccount
          v-decorator="[
            'receiveAccount',
            {
              initialValue: step.receiveAccount,
              rules: [{ required: true, message: '请输入收款账户',
                validator: (rule, value, callback) => {
                  if(value && value.number) {
                    callback()
                  } else {
                    callback(false)
                  }
                }
              }]
            }
          ]"
          placeholder="请输入收款账号"
        />
      </a-form-item>
      <a-form-item>
        <a-button type="primary" @click="handleSubmit">下一步</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
import ReceiveAccount from "@/components/ReceiverAccount"
export default {
  data() {
    this.form = this.$form.createForm(this);
    return {
      formItemLayout: {
        labelCol: { span: 4 },
        wrapperCol: { span: 14 }
      }
    };
  },
  components: {
    ReceiveAccount
  },
  computed: {
    step() {
      return this.$store.state.form.step;
    }
  },
  methods: {
    handleSubmit() {
      const { form, $router, $store } = this; // 使用解构赋值对 form、$router、$store进行赋值
      console.log("下一步", this)
      form.validateFields((err, values) => {  // validateFields form组件表单验证
        if (!err) {
          $store.commit({
            type: "form/saveStepFormData",  // 触发state中的form中的saveStepFormData
            payload: values
          });
          $router.push("/form/step-form/confirm");
        }
      });
    }
  }
};
</script>

<style></style>