# 鸿创工作室官网与论坛社区平台后端

技术栈：
- Spring Boot 3.3.x
- Java 17
- MyBatis Plus
- MySQL 8
- Redis 7
- Spring Security + JWT

## 本次关键修复

- 修复登录时对 Redis 的强依赖：Redis 不可用时，登录可继续完成
- 新增论坛ID `forum_uid`：从 `10001` 开始分配，自动跳过部分豹子号/寓意号
- 新增开发环境默认管理员自动创建：
  - 用户名：`admin`
  - 密码：`Admin@123456`

## 旧数据库升级

如果你已经执行过旧版 `schema.sql`，先执行：

```sql
SOURCE sql/upgrade_v2.sql;
```

然后重启项目，程序会自动：
1. 为 `forum_uid` 为空的历史用户按注册先后补发论坛ID
2. 同步论坛ID序列表
3. 在开发环境下自动创建默认管理员

## 本地启动

1. 创建数据库 `hongchuang_platform`
2. 新库执行 `sql/schema.sql`
3. 旧库执行 `sql/upgrade_v2.sql`
4. 修改 `application-dev.yml` 中 MySQL / Redis 配置
5. 启动项目

```bash
java -jar target/hongchuang-platform-1.0.0.jar --spring.profiles.active=dev
```

## 默认说明

- 权限角色：`USER` / `ADMIN`
- JWT Header：`Authorization: Bearer <token>`
- 密码加密：BCrypt
- 登录失败限制：Redis 可用时生效；Redis 不可用时自动降级
- 开发环境默认管理员：`admin / Admin@123456`

## 开发环境配置说明

`application-dev.yml` 已改成支持环境变量覆盖：

- `MYSQL_URL`
- `MYSQL_USERNAME`
- `MYSQL_PASSWORD`
- `REDIS_HOST`
- `REDIS_PORT`
- `HC_ADMIN_USERNAME`
- `HC_ADMIN_PASSWORD`

如果你本机 MySQL 不是 `root/123456`，直接改环境变量或修改 `application-dev.yml` 即可。


## 本轮新增补全

- 私信会话列表接口：`GET /api/v1/notifications/private-messages/sessions`
- 用户搜索接口：`GET /api/v1/users/search?keyword=xxx&limit=12`
- 开发配置不再内置真实邮件凭据，统一改为环境变量

## 本轮继续补全（第二批）

- 新增钱包后台治理接口：
  - `GET /api/v1/admin/wallet/overview`
  - `GET /api/v1/admin/wallet/rules`
  - `POST /api/v1/admin/wallet/rules`
  - `PUT /api/v1/admin/wallet/rules/{id}`
  - `PATCH /api/v1/admin/wallet/rules/{id}/status`
  - `GET /api/v1/admin/wallet/logs`
  - `POST /api/v1/admin/wallet/adjust`
  - `GET /api/v1/admin/wallet/users/{userId}`
- 兑换规则 `dailyLimit` 现在已真实生效，不再只是展示字段
- 新增官网 CMS 页面配置：
  - 公共读取：`GET /api/v1/site-pages/{pageCode}`
  - 后台管理：`/api/v1/admin/site-pages/**`
- 新增数据库升级脚本：`sql/upgrade_v12_wallet_cms.sql`

### 升级步骤

旧库请在已有升级脚本之后继续执行：

```sql
SOURCE sql/upgrade_v12_wallet_cms.sql;
```

执行后可获得：
- `cms_site_page` 官网页面配置表
- 首页与联系页默认配置种子数据


## v13 补全内容（资源标签闭环 + 账号注销）

### 资源标签闭环
- 前台资源发布页已改为真实标签选择，不再让用户手输逗号文本
- 资源列表支持 `tagId` 筛选
- 资源详情与资源卡片支持展示标签并点击跳转筛选

### 账号注销
- 发送注销邮箱验证码：`POST /api/v1/users/me/cancel/email-code`
- 提交账号注销：`POST /api/v1/users/me/cancel`
- 注销后会：
  - 立即失效当前登录态
  - 账号状态改为停用并标记删除
  - 用户昵称匿名化为“已注销用户”
  - 历史发帖 / 评论 / 资源仍保留，但展示为已注销用户
