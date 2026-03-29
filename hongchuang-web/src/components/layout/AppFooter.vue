<template>
  <footer class="footer">
    <div class="hc-container footer-inner">
      <div>
        <div class="title">鸿创工作室</div>
        <div class="desc">一个面向玩家、服主和创作者的交流社区，支持论坛讨论、资源发布、私信沟通和团队联系。</div>
      </div>
      <div class="links">
        <RouterLink to="/policies/user-agreement">用户协议</RouterLink>
        <RouterLink to="/policies/privacy-policy">隐私政策</RouterLink>
        <RouterLink to="/policies/community-guidelines">社区规范</RouterLink>
      </div>
      <div class="copy">© 2026 鸿创工作室. All rights reserved.</div>
    </div>
  </footer>
</template>

<style scoped lang="scss">
.footer {
  border-top: 1px solid rgba(229, 231, 235, 0.75);
  background: rgba(255, 255, 255, 0.86);
  backdrop-filter: blur(12px);
}
.footer-inner {
  padding: 28px 0 36px;
  display: grid;
  grid-template-columns: 1.4fr 1fr auto;
  gap: 20px;
  align-items: center;
}
.title {
  font-weight: 700;
  margin-bottom: 8px;
}
.desc {
  color: var(--hc-text-secondary);
  line-height: 1.7;
}
.links {
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
}
.copy {
  color: var(--hc-text-secondary);
  white-space: nowrap;
}
@media (max-width: 900px) {
  .footer-inner {
    grid-template-columns: 1fr;
    text-align: center;
  }
}
</style>
