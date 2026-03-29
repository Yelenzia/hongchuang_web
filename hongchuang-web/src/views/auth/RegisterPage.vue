<template>
  <div class="auth-page hc-container">
    <div class="hc-card auth-card">
      <div class="head">
        <div class="badge">创建账号</div>
        <h1>注册鸿创工作室账号</h1>
        <p>注册需要邮箱验证码与图形验证码，用于避免机器批量注册。</p>
      </div>

      <el-form ref="formRef" :model="form" :rules="rules" label-position="top" @submit.prevent>
        <el-form-item label="用户名" prop="username"><el-input v-model="form.username" placeholder="4~32 位用户名" /></el-form-item>
        <el-form-item label="邮箱" prop="email"><el-input v-model="form.email" placeholder="请输入邮箱" /></el-form-item>
        <el-form-item label="图形验证码" prop="captchaCode"><CaptchaBox v-model="form.captchaCode" :image-base64="captcha.imageBase64" @refresh="loadCaptcha" /></el-form-item>
        <el-form-item label="邮箱验证码" prop="emailCode">
          <div class="code-row"><el-input v-model="form.emailCode" placeholder="请输入邮箱验证码" /><el-button plain :disabled="cooldown > 0" :loading="sending" @click="handleSendCode">{{ cooldown > 0 ? `${cooldown}s后重试` : '发送验证码' }}</el-button></div>
          <div v-if="showDebugCode && debugCode" class="debug-tip">开发调试验证码：{{ debugCode }}</div>
        </el-form-item>
        <el-form-item label="密码" prop="password"><el-input v-model="form.password" type="password" show-password placeholder="8~20 位，需包含字母和数字" /></el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword"><el-input v-model="form.confirmPassword" type="password" show-password placeholder="再次输入密码" /></el-form-item>
        <el-checkbox v-model="agree">我已阅读并同意用户协议与隐私政策</el-checkbox>
        <el-button class="submit-btn" type="primary" size="large" :loading="submitting" @click="handleRegister">注册</el-button>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import { isEmail, passwordRule } from '@/utils/validate'
import { useRouter } from 'vue-router'
import { getCaptchaApi, registerApi, sendEmailCodeApi } from '@/api/auth'
import CaptchaBox from '@/components/auth/CaptchaBox.vue'

const router = useRouter()
const formRef = ref<FormInstance>()
const submitting = ref(false)
const sending = ref(false)
const agree = ref(false)
const debugCode = ref('')
const showDebugCode = import.meta.env.VITE_SHOW_DEBUG_CODE === 'true'
const cooldown = ref(0)
let timer: number | undefined
const captcha = reactive({ captchaId: '', imageBase64: '' })
const form = reactive({ username: '', email: '', password: '', confirmPassword: '', emailCode: '', captchaId: '', captchaCode: '' })

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

const validateConfirmPassword = (_rule: unknown, value: string, callback: (error?: Error) => void) => {
  if (value !== form.password) return callback(new Error('两次输入的密码不一致'))
  callback()
}
const rules: FormRules<typeof form> = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }, { min: 4, max: 32, message: '用户名长度需在 4~32 位之间', trigger: 'blur' }, { pattern: /^[A-Za-z0-9_\-一-龥]+$/, message: '用户名仅支持中英文、数字、下划线和短横线', trigger: 'blur' }],
  email: [{ required: true, message: '请输入邮箱', trigger: 'blur' }, { validator: (_rule, value, callback) => callback(isEmail(value) ? undefined : new Error('邮箱格式不正确')), trigger: 'blur' }],
  captchaCode: [{ required: true, message: '请输入图形验证码', trigger: 'blur' }],
  emailCode: [{ required: true, message: '请输入邮箱验证码', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }, { validator: (_rule, value, callback) => callback(passwordRule.test(value) ? undefined : new Error('密码需 8~20 位，且至少包含字母和数字')), trigger: 'blur' }],
  confirmPassword: [{ required: true, message: '请再次输入密码', trigger: 'blur' }, { validator: validateConfirmPassword, trigger: 'blur' }]
}

const loadCaptcha = async () => { const { data } = await getCaptchaApi(); captcha.captchaId = data.captchaId; captcha.imageBase64 = data.imageBase64; form.captchaId = data.captchaId; form.captchaCode = '' }
const handleSendCode = async () => {
  if (!form.email || !isEmail(form.email)) return ElMessage.warning('请先输入正确邮箱')
  if (!form.captchaCode || !form.captchaId) return ElMessage.warning('请先输入图形验证码')
  sending.value = true
  try {
    const { data } = await sendEmailCodeApi({ bizType: 'REGISTER', email: form.email, captchaId: form.captchaId, captchaCode: form.captchaCode })
    debugCode.value = data.debugCode || ''
    startCooldown(data.cooldownSeconds || 60)
    ElMessage.success(data.message || '验证码已发送')
    await loadCaptcha()
  } finally { sending.value = false }
}
const handleRegister = async () => {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return
  if (!agree.value) return ElMessage.warning('请先勾选协议')
  submitting.value = true
  try { await registerApi({ ...form }); ElMessage.success('注册成功，请登录'); router.push({ name: 'login', query: { account: form.username } }) } finally { submitting.value = false }
}

onMounted(loadCaptcha)
onBeforeUnmount(() => window.clearInterval(timer))
</script>

<style scoped lang="scss">
.auth-page { min-height: calc(100vh - 160px); padding-top: 120px; padding-bottom: 60px; display: grid; place-items: center; }
.auth-card { width: min(580px, 100%); padding: 32px; }
.badge { display: inline-flex; padding: 8px 14px; border-radius: 999px; background: rgba(18, 181, 203, 0.08); color: var(--hc-primary-deep); font-weight: 700; }
.head h1 { margin: 16px 0 12px; }
.head p { margin: 0 0 18px; color: var(--hc-text-secondary); }
.code-row { display: grid; grid-template-columns: 1fr 132px; gap: 10px; width: 100%; }
.debug-tip { margin-top: 8px; font-size: 12px; color: #f59e0b; }
.submit-btn { width: 100%; margin-top: 18px; }
</style>
