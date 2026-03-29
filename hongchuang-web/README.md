# 鸿创工作室前台（hongchuang-web）

## 技术栈
- Vue 3
- Vite
- TypeScript
- Pinia
- Vue Router
- Element Plus

## 已包含页面
- 官网首页
- 论坛页
- 板块页
- 帖子详情页
- 登录页
- 注册页
- 找回密码页
- 用户中心页
- 私信中心（会话列表 / 搜索用户发起聊天）
- 用户主页
- 团队联系页
- 用户协议 / 隐私政策 / 社区规范页

## 运行
```bash
npm install
npm run dev
```

## 构建
```bash
npm run build
```

## 接口说明
默认读取 `.env.development` / `.env.production` 中的 `VITE_API_BASE_URL`。
当前页面支持前端演示态，后续接入后端可直接替换 `src/api/*` 调用逻辑。


## 调试验证码显示
开发环境可通过 `VITE_SHOW_DEBUG_CODE=true` 显示调试验证码；生产环境请保持 `false`。
