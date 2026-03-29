<template>
  <div class="security-page">
    <div>
      <div class="section-title">安全设置</div>
      <div class="sub">修改密码和注销账号前都需要先通过图形验证码并获取邮箱验证码。</div>
    </div>

    <section class="hc-card form-card">
      <div class="card-title">修改密码</div>
      <el-form ref="formRef" :model="form" :rules="rules" label-position="top" class="security-form">
        <el-form-item label="旧密码" prop="oldPassword">
          <el-input v-model="form.oldPassword" type="password" show-password placeholder="请输入当前密码" />
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input v-model="form.newPassword" type="password" show-password placeholder="请输入新密码" />
        </el-form-item>
        <el-form-item label="确认新密码" prop="confirmPassword">
          <el-input v-model="form.confirmPassword" type="password" show-password placeholder="请再次输入新密码" />
        </el-form-item>
        <el-form-item label="图形验证码" prop="captchaCode">
          <CaptchaBox v-model="form.captchaCode" :image-base64="captcha.imageBase64" @refresh="loadCaptcha" />
        </el-form-item>
        <el-form-item label="邮箱验证码" prop="emailCode">
          <div class="email-row">
            <el-input v-model="form.emailCode" placeholder="请输入邮箱验证码" />
            <el-button :disabled="cooldown > 0" @click="handleSendPasswordCode">{{ cooldown > 0 ? `${cooldown}s 后重试` : '发送验证码' }}</el-button>
          </div>
        </el-form-item>
      </el-form>

      <div class="actions">
        <el-button type="primary" :loading="submitting" @click="handleSubmit">修改密码</el-button>
      </div>
    </section>

    <section class="hc-card device-card">
      <div class="card-title">登录设备管理</div>
      <div class="danger-desc">这里展示最近登录过的设备。你可以手动下线陌生设备，也可以一键下线其他设备。</div>
      <div class="device-actions">
        <el-button plain @click="loadDevices">刷新列表</el-button>
        <el-button type="warning" plain @click="handleRevokeOthers">下线其他设备</el-button>
      </div>
      <div v-loading="devicesLoading" class="device-list">
        <div v-if="!devices.length" class="device-empty">当前暂无可管理的登录设备。</div>
        <div v-for="item in devices" :key="item.sessionId" class="device-item">
          <div>
            <div class="device-name-row">
              <span class="device-name">{{ item.deviceName }}</span>
              <el-tag :type="item.current ? 'success' : item.status === 1 ? 'info' : 'danger'">{{ item.current ? '当前设备' : item.status === 1 ? '在线' : '已失效' }}</el-tag>
            </div>
            <div class="device-meta">{{ item.browser }} · {{ item.os }} · {{ item.loginIp || '-' }}</div>
            <div class="device-meta">登录时间：{{ formatTime(item.loginTime) }} ｜ 最近活跃：{{ formatTime(item.lastActiveAt) }}</div>
          </div>
          <el-button plain type="danger" :disabled="item.current || item.status !== 1" @click="handleRevokeDevice(item)">下线</el-button>
        </div>
      </div>
    </section>

    <section class="hc-card danger-card">
      <div class="card-title danger">危险操作</div>
      <div class="danger-desc">注销账号后，将无法再使用当前账号登录，昵称会被匿名化，已发布内容会保留为“已注销用户”。该操作不可恢复。</div>

      <el-form ref="cancelFormRef" :model="cancelForm" :rules="cancelRules" label-position="top" class="security-form">
        <el-form-item label="当前密码" prop="password">
          <el-input v-model="cancelForm.password" type="password" show-password placeholder="请输入当前密码以确认操作" />
        </el-form-item>
        <el-form-item label="注销原因">
          <el-input v-model="cancelForm.reason" type="textarea" :rows="3" maxlength="200" show-word-limit placeholder="选填，帮助我们改进产品体验" />
        </el-form-item>
        <el-form-item label="图形验证码" prop="captchaCode">
          <CaptchaBox v-model="cancelForm.captchaCode" :image-base64="cancelCaptcha.imageBase64" @refresh="loadCancelCaptcha" />
        </el-form-item>
        <el-form-item label="邮箱验证码" prop="emailCode">
          <div class="email-row">
            <el-input v-model="cancelForm.emailCode" placeholder="请输入邮箱验证码" />
            <el-button :disabled="cancelCooldown > 0" @click="handleSendCancelCode">{{ cancelCooldown > 0 ? `${cancelCooldown}s 后重试` : '发送注销验证码' }}</el-button>
          </div>
        </el-form-item>
      </el-form>

      <div class="actions">
        <el-button type="danger" :loading="cancelSubmitting" @click="handleCancelAccount">注销当前账号</el-button>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage, ElMessageBox } from 'element-plus'
import CaptchaBox from '@/components/auth/CaptchaBox.vue'
import { getCaptchaApi } from '@/api/auth'
import { cancelMyAccountApi, changePasswordApi, getMyLoginDevicesApi, revokeMyLoginDeviceApi, revokeOtherLoginDevicesApi, sendCancelAccountCodeApi, sendChangePasswordCodeApi } from '@/api/user'
import { useAuthStore } from '@/store/auth'
import type { LoginDeviceItem } from '@/types/search'

const router = useRouter()
const authStore = useAuthStore()
const formRef = ref<FormInstance>()
const cancelFormRef = ref<FormInstance>()
const submitting = ref(false)
const cancelSubmitting = ref(false)
const cooldown = ref(0)
const cancelCooldown = ref(0)
const devicesLoading = ref(false)
const devices = ref<LoginDeviceItem[]>([])
let timer: number | undefined
let cancelTimer: number | undefined

const captcha = reactive({ captchaId: '', imageBase64: '' })
const cancelCaptcha = reactive({ captchaId: '', imageBase64: '' })

const form = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: '',
  captchaCode: '',
  emailCode: ''
})

const cancelForm = reactive({
  password: '',
  reason: '',
  captchaCode: '',
  emailCode: ''
})

const rules: FormRules<typeof form> = {
  oldPassword: [{ required: true, message: '请输入旧密码', trigger: 'blur' }],
  newPassword: [{ required: true, message: '请输入新密码', trigger: 'blur' }, { min: 8, message: '密码至少 8 位', trigger: 'blur' }],
  confirmPassword: [{ required: true, message: '请再次输入新密码', trigger: 'blur' }],
  captchaCode: [{ required: true, message: '请输入图形验证码', trigger: 'blur' }],
  emailCode: [{ required: true, message: '请输入邮箱验证码', trigger: 'blur' }]
}

const cancelRules: FormRules<typeof cancelForm> = {
  password: [{ required: true, message: '请输入当前密码', trigger: 'blur' }],
  captchaCode: [{ required: true, message: '请输入图形验证码', trigger: 'blur' }],
  emailCode: [{ required: true, message: '请输入邮箱验证码', trigger: 'blur' }]
}


const formatTime = (value?: string | null) => {
  if (!value) return '-'
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString('zh-CN', { hour12: false })
}

const loadDevices = async () => {
  devicesLoading.value = true
  try {
    const { data } = await getMyLoginDevicesApi()
    devices.value = Array.isArray(data) ? data : []
  } finally {
    devicesLoading.value = false
  }
}

const handleRevokeDevice = async (item: LoginDeviceItem) => {
  await ElMessageBox.confirm(`确定下线设备「${item.deviceName}」吗？`, '下线设备', { type: 'warning' })
  await revokeMyLoginDeviceApi(item.sessionId)
  ElMessage.success('设备已下线')
  await loadDevices()
}

const handleRevokeOthers = async () => {
  await ElMessageBox.confirm('确定下线其他所有设备吗？当前设备会保留登录。', '下线其他设备', { type: 'warning' })
  await revokeOtherLoginDevicesApi()
  ElMessage.success('其他设备已全部下线')
  await loadDevices()
}

const loadCaptcha = async () => {
  const { data } = await getCaptchaApi()
  captcha.captchaId = data.captchaId
  captcha.imageBase64 = data.imageBase64
  form.captchaCode = ''
}

const loadCancelCaptcha = async () => {
  const { data } = await getCaptchaApi()
  cancelCaptcha.captchaId = data.captchaId
  cancelCaptcha.imageBase64 = data.imageBase64
  cancelForm.captchaCode = ''
}

const startCooldown = (target: typeof cooldown, key: 'password' | 'cancel', seconds = 60) => {
  target.value = seconds
  if (key === 'password') {
    window.clearInterval(timer)
    timer = window.setInterval(() => {
      target.value -= 1
      if (target.value <= 0) window.clearInterval(timer)
    }, 1000)
    return
  }
  window.clearInterval(cancelTimer)
  cancelTimer = window.setInterval(() => {
    target.value -= 1
    if (target.value <= 0) window.clearInterval(cancelTimer)
  }, 1000)
}

const handleSendPasswordCode = async () => {
  if (!form.captchaCode.trim() || !captcha.captchaId) {
    ElMessage.warning('请先输入图形验证码')
    return
  }
  const { data } = await sendChangePasswordCodeApi({ bizType: 'CHANGE_PASSWORD', captchaId: captcha.captchaId, captchaCode: form.captchaCode.trim() })
  ElMessage.success(data.message || '邮箱验证码已发送')
  startCooldown(cooldown, 'password', data.cooldownSeconds || 60)
  await loadCaptcha()
}

const handleSendCancelCode = async () => {
  if (!cancelForm.captchaCode.trim() || !cancelCaptcha.captchaId) {
    ElMessage.warning('请先输入图形验证码')
    return
  }
  const { data } = await sendCancelAccountCodeApi({ bizType: 'CANCEL_ACCOUNT', captchaId: cancelCaptcha.captchaId, captchaCode: cancelForm.captchaCode.trim() })
  ElMessage.success(data.message || '注销验证码已发送')
  startCooldown(cancelCooldown, 'cancel', data.cooldownSeconds || 60)
  await loadCancelCaptcha()
}

const handleSubmit = async () => {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return
  submitting.value = true
  try {
    await changePasswordApi({
      oldPassword: form.oldPassword,
      newPassword: form.newPassword,
      confirmPassword: form.confirmPassword,
      emailCode: form.emailCode,
      captchaId: captcha.captchaId,
      captchaCode: form.captchaCode
    })
    ElMessage.success('密码修改成功')
    form.oldPassword = ''
    form.newPassword = ''
    form.confirmPassword = ''
    form.emailCode = ''
    await loadCaptcha()
  } finally {
    submitting.value = false
  }
}

const handleCancelAccount = async () => {
  const valid = await cancelFormRef.value?.validate().catch(() => false)
  if (!valid) return
  await ElMessageBox.confirm('注销账号后无法恢复，且会立即退出登录。确定继续吗？', '确认注销账号', {
    type: 'warning',
    confirmButtonText: '确认注销',
    cancelButtonText: '我再想想'
  })
  cancelSubmitting.value = true
  try {
    await cancelMyAccountApi({
      password: cancelForm.password,
      reason: cancelForm.reason,
      emailCode: cancelForm.emailCode,
      captchaId: cancelCaptcha.captchaId,
      captchaCode: cancelForm.captchaCode
    })
    ElMessage.success('账号已注销')
    authStore.clearAuth()
    router.replace('/login')
  } finally {
    cancelSubmitting.value = false
  }
}

onMounted(async () => {
  await Promise.all([loadCaptcha(), loadCancelCaptcha(), loadDevices()])
})

onBeforeUnmount(() => {
  window.clearInterval(timer)
  window.clearInterval(cancelTimer)
})
</script>

<style scoped lang="scss">
.security-page { display: flex; flex-direction: column; gap: 16px; }
.section-title { font-size: 22px; font-weight: 700; }
.sub { color: var(--hc-text-secondary); margin-top: 6px; }
.form-card, .danger-card, .device-card { padding: 20px; }
.card-title { font-size: 18px; font-weight: 700; margin-bottom: 14px; }
.card-title.danger { color: #b91c1c; }
.danger-desc { color: var(--hc-text-secondary); line-height: 1.8; margin-bottom: 16px; }
.security-form { max-width: 680px; }
.email-row { display: grid; grid-template-columns: 1fr auto; gap: 10px; width: 100%; }
.actions { display: flex; justify-content: flex-end; }
.device-actions { display: flex; gap: 10px; justify-content: flex-end; margin-bottom: 14px; }
.device-list { display: grid; gap: 12px; }
.device-item { display: flex; justify-content: space-between; gap: 16px; padding: 14px 16px; border-radius: 14px; background: rgba(15, 23, 42, 0.04); align-items: center; }
.device-name-row { display: flex; gap: 10px; align-items: center; margin-bottom: 6px; }
.device-name { font-size: 16px; font-weight: 700; }
.device-meta { color: var(--hc-text-secondary); line-height: 1.8; }
.device-empty { color: var(--hc-text-secondary); }
.danger-card { border: 1px solid rgba(185, 28, 28, 0.12); background: rgba(185, 28, 28, 0.03); }
</style>
