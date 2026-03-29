<template>
  <div class="login-page">
    <div class="login-card">
      <div class="badge">鸿创工作室</div>
      <h1>管理后台登录</h1>
      <p>管理员登录同样启用图形验证码与邮箱验证码。</p>

      <el-form ref="formRef" :model="form" :rules="rules" label-position="top">
        <el-form-item label="管理员账号" prop="account">
          <el-input v-model="form.account" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="form.password" type="password" show-password />
        </el-form-item>
        <el-form-item label="图形验证码" prop="captchaCode">
          <CaptchaBox v-model="form.captchaCode" :image-base64="captcha.imageBase64" @refresh="loadCaptcha" />
        </el-form-item>
        <el-form-item label="邮箱验证码" prop="emailCode">
          <div class="code-row">
            <el-input v-model="form.emailCode" />
            <el-button plain :loading="sending" @click="handleSendCode">发送验证码</el-button>
          </div>
          <div v-if="showDebugCode && debugCode" class="debug-tip">开发调试验证码：{{ debugCode }}</div>
        </el-form-item>
        <el-button class="submit" type="primary" size="large" :loading="submitting" @click="handleLogin">登录后台</el-button>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { useAdminAuthStore } from '@/store/auth'
import { useRouter } from 'vue-router'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { getCaptchaApi, sendEmailCodeApi } from '@/api/auth'
import CaptchaBox from '@/components/forms/CaptchaBox.vue'

const form = reactive({ account: '', password: '', emailCode: '', captchaId: '', captchaCode: '' })
const rules: FormRules<typeof form> = {
  account: [{ required: true, message: '请输入管理员账号', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  captchaCode: [{ required: true, message: '请输入图形验证码', trigger: 'blur' }],
  emailCode: [{ required: true, message: '请输入邮箱验证码', trigger: 'blur' }]
}

const formRef = ref<FormInstance>()
const submitting = ref(false)
const sending = ref(false)
const debugCode = ref('')
const showDebugCode = import.meta.env.VITE_SHOW_DEBUG_CODE === 'true'
const captcha = reactive({ captchaId: '', imageBase64: '' })
const authStore = useAdminAuthStore()
const router = useRouter()

const loadCaptcha = async () => {
  const { data } = await getCaptchaApi()
  captcha.captchaId = data.captchaId
  captcha.imageBase64 = data.imageBase64
  form.captchaId = data.captchaId
  form.captchaCode = ''
}

const handleSendCode = async () => {
  if (!form.account.trim()) { ElMessage.warning('请先输入管理员账号'); return }
  if (!form.captchaCode.trim()) { ElMessage.warning('请先输入图形验证码'); return }
  sending.value = true
  try {
    const { data } = await sendEmailCodeApi({ bizType: 'LOGIN', account: form.account, captchaId: form.captchaId, captchaCode: form.captchaCode })
    debugCode.value = data.debugCode || ''
    ElMessage.success(data.message || '验证码已发送')
    await loadCaptcha()
  } finally { sending.value = false }
}

const handleLogin = async () => {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return

  submitting.value = true
  try {
    await authStore.login({ ...form })
    ElMessage.success('管理员登录成功')
    router.push('/dashboard')
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : '登录失败')
  } finally {
    submitting.value = false
  }
}

onMounted(loadCaptcha)
</script>

<style scoped lang="scss">
.login-page{min-height:100vh;display:grid;place-items:center;background:radial-gradient(circle at top, rgba(37,99,235,.08), transparent 45%),#f5f7fb}.login-card{width:min(520px,92vw);background:#fff;padding:32px;border-radius:24px;box-shadow:0 24px 60px rgba(15,23,42,.08)}.badge{display:inline-flex;padding:8px 14px;border-radius:999px;background:rgba(37,99,235,.08);color:#2563eb;font-weight:700}.submit{width:100%;margin-top:8px}.code-row{display:grid;grid-template-columns:1fr 132px;gap:10px;width:100%}.debug-tip{margin-top:8px;font-size:12px;color:#f59e0b}
</style>
