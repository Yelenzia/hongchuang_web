<template>
  <div class="auth-page hc-container">
    <div class="auth-card hc-card minecraft-card">
      <div class="title">找回密码</div>
      <div class="sub">先获取邮箱验证码，再重置你的账号密码。</div>

      <el-form ref="formRef" :model="form" :rules="rules" label-position="top">
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email" placeholder="请输入注册邮箱" />
        </el-form-item>
        <el-form-item label="图形验证码" prop="captchaCode">
          <CaptchaBox v-model="form.captchaCode" :image-base64="captcha.imageBase64" @refresh="loadCaptcha" />
        </el-form-item>
        <el-form-item label="邮箱验证码" prop="code">
          <div class="email-row">
            <el-input v-model="form.code" placeholder="请输入邮箱验证码" />
            <el-button :disabled="cooldown > 0" @click="handleSendCode">{{ cooldown > 0 ? `${cooldown}s 后重试` : '发送验证码' }}</el-button>
          </div>
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input v-model="form.newPassword" type="password" show-password placeholder="请输入新密码" />
        </el-form-item>
        <el-form-item label="确认新密码" prop="confirmPassword">
          <el-input v-model="form.confirmPassword" type="password" show-password placeholder="请再次输入新密码" />
        </el-form-item>
      </el-form>

      <div class="actions">
        <RouterLink to="/login"><el-button plain>返回登录</el-button></RouterLink>
        <el-button type="primary" :loading="submitting" @click="handleSubmit">重置密码</el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import CaptchaBox from '@/components/auth/CaptchaBox.vue'
import { forgotPasswordApi, getCaptchaApi, resetPasswordApi } from '@/api/auth'

const formRef = ref<FormInstance>()
const submitting = ref(false)
const cooldown = ref(0)
let timer: number | undefined
const captcha = reactive({ captchaId: '', imageBase64: '' })
const form = reactive({
  email: '',
  captchaCode: '',
  code: '',
  newPassword: '',
  confirmPassword: ''
})

const rules: FormRules<typeof form> = {
  email: [{ required: true, message: '请输入邮箱', trigger: 'blur' }],
  captchaCode: [{ required: true, message: '请输入图形验证码', trigger: 'blur' }],
  code: [{ required: true, message: '请输入邮箱验证码', trigger: 'blur' }],
  newPassword: [{ required: true, message: '请输入新密码', trigger: 'blur' }, { min: 8, message: '密码至少 8 位', trigger: 'blur' }],
  confirmPassword: [{ required: true, message: '请再次输入新密码', trigger: 'blur' }]
}

const loadCaptcha = async () => {
  const { data } = await getCaptchaApi()
  captcha.captchaId = data.captchaId
  captcha.imageBase64 = data.imageBase64
  form.captchaCode = ''
}

const startCooldown = (seconds = 60) => {
  cooldown.value = seconds
  window.clearInterval(timer)
  timer = window.setInterval(() => {
    cooldown.value -= 1
    if (cooldown.value <= 0) {
      window.clearInterval(timer)
    }
  }, 1000)
}

const handleSendCode = async () => {
  if (!form.email.trim() || !form.captchaCode.trim() || !captcha.captchaId) {
    ElMessage.warning('请先填写邮箱和图形验证码')
    return
  }
  const { data } = await forgotPasswordApi({ email: form.email.trim(), captchaId: captcha.captchaId, captchaCode: form.captchaCode.trim() })
  ElMessage.success(data.message || '邮箱验证码已发送')
  startCooldown(data.cooldownSeconds || 60)
  await loadCaptcha()
}

const handleSubmit = async () => {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return
  submitting.value = true
  try {
    await resetPasswordApi({
      email: form.email.trim(),
      code: form.code.trim(),
      newPassword: form.newPassword,
      confirmPassword: form.confirmPassword,
      captchaId: captcha.captchaId,
      captchaCode: form.captchaCode.trim()
    })
    ElMessage.success('密码重置成功，请返回登录')
  } finally {
    submitting.value = false
  }
}

onMounted(loadCaptcha)
</script>

<style scoped lang="scss">
.auth-page { min-height: 100vh; display: grid; place-items: center; padding-top: 108px; padding-bottom: 48px; }
.auth-card { width: min(520px, 100%); padding: 28px; }
.title { font-size: 28px; font-weight: 700; }
.sub { color: var(--hc-text-secondary); margin: 8px 0 20px; }
.email-row { display: grid; grid-template-columns: 1fr auto; gap: 10px; width: 100%; }
.actions { display: flex; justify-content: space-between; gap: 12px; margin-top: 8px; }
</style>
