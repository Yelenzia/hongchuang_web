CREATE TABLE IF NOT EXISTS content_draft (
  id BIGINT PRIMARY KEY,
  draft_type VARCHAR(32) NOT NULL COMMENT 'POST/RESOURCE',
  scene_code VARCHAR(64) DEFAULT NULL COMMENT '插件发布/教程分享等场景码',
  owner_user_id BIGINT NOT NULL,
  title VARCHAR(150) DEFAULT NULL,
  summary VARCHAR(500) DEFAULT NULL,
  content_markdown LONGTEXT,
  extra_json LONGTEXT COMMENT '额外表单数据 JSON',
  status TINYINT DEFAULT 0 COMMENT '0草稿 1已归档',
  auto_saved TINYINT DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted TINYINT DEFAULT 0,
  KEY idx_content_draft_owner (owner_user_id, draft_type, deleted),
  KEY idx_content_draft_updated (updated_at),
  KEY idx_content_draft_scene (scene_code, deleted)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS content_template (
  id BIGINT PRIMARY KEY,
  template_name VARCHAR(80) NOT NULL,
  template_type VARCHAR(32) NOT NULL COMMENT 'POST/RESOURCE',
  scene_code VARCHAR(64) NOT NULL,
  title_example VARCHAR(150) DEFAULT NULL,
  summary_example VARCHAR(500) DEFAULT NULL,
  content_markdown LONGTEXT,
  extra_json LONGTEXT COMMENT '可选扩展信息',
  enabled TINYINT DEFAULT 1,
  sort_order INT DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted TINYINT DEFAULT 0,
  KEY idx_content_template_type (template_type, enabled, deleted),
  KEY idx_content_template_scene (scene_code, enabled, deleted)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS upload_file_log (
  id BIGINT PRIMARY KEY,
  user_id BIGINT DEFAULT NULL,
  biz_type VARCHAR(64) NOT NULL COMMENT 'EDITOR_IMAGE/RESOURCE_COVER/POST_FILE/AVATAR',
  file_name VARCHAR(255) NOT NULL,
  file_url VARCHAR(500) NOT NULL,
  file_ext VARCHAR(32) DEFAULT NULL,
  content_type VARCHAR(128) DEFAULT NULL,
  file_size BIGINT DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted TINYINT DEFAULT 0,
  KEY idx_upload_file_log_user (user_id, biz_type, deleted),
  KEY idx_upload_file_log_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO content_template (id, template_name, template_type, scene_code, title_example, summary_example, content_markdown, enabled, sort_order, deleted)
VALUES
(3101, '插件发布模板', 'POST', 'PLUGIN', '【插件发布】插件名称 + 版本 + 功能简介', '一句话说明这个插件适合什么服务器或玩法。',
'# 插件名称\n\n> 这里先写一句话介绍插件定位。\n\n## 基础信息\n- 适用版本：1.12.2 / 1.16 / 1.20\n- 运行环境：Spigot / Paper / Folia\n- 开发状态：持续更新\n\n## 功能亮点\n- 功能 1\n- 功能 2\n- 功能 3\n\n## 指令与权限\n```text\n/plugin help\n/plugin reload\n```\n\n## 安装方式\n1. 下载插件\n2. 放入 plugins 目录\n3. 重启服务器\n\n## 截图展示\n![](在这里插入图片地址)\n\n## 更新日志\n- v1.0.0 首次发布\n\n## 下载说明\n- 下载地址：\n- 使用须知：\n', 1, 10, 0),
(3102, '服务器宣传模板', 'POST', 'SERVER', '【服务器宣传】服务器名称 + 特色玩法', '一句话概括服务器核心玩法与定位。',
'# 服务器名称\n\n## 服务器简介\n- 类型：RPG / 生存 / 空岛 / 小游戏\n- 版本支持：1.12.2 - 1.20.x\n- 核心特色：\n\n## 特色玩法\n1. 玩法一\n2. 玩法二\n3. 玩法三\n\n## 入服方式\n- IP：\n- QQ 群：\n- 官网：\n\n## 服务器截图\n![](在这里插入图片地址)\n\n## 招募信息\n- 是否招新：\n- 招募方向：\n', 1, 20, 0),
(3103, '教程分享模板', 'POST', 'TUTORIAL', '【教程分享】主题 + 适用人群', '一句话告诉大家这篇教程能解决什么问题。',
'# 教程标题\n\n## 适用对象\n- 新手 / 服主 / 插件开发者\n\n## 先看效果\n> 这里可以先说明最终效果。\n\n## 操作步骤\n### 第一步\n详细说明\n\n### 第二步\n详细说明\n\n## 示例代码\n```java\npublic class Example {\n    public static void main(String[] args) {\n        System.out.println(\"Hello HongChuang\");\n    }\n}\n```\n\n## 常见问题\n- 问题 1\n- 问题 2\n', 1, 30, 0),
(3104, '问题求助模板', 'POST', 'QUESTION', '【问题求助】问题现象 + 版本环境', '一句话说明你遇到了什么问题。',
'# 问题描述\n\n## 运行环境\n- Minecraft 版本：\n- 服务端核心：\n- Java 版本：\n- 插件列表：\n\n## 报错信息\n```text\n把控制台报错贴在这里\n```\n\n## 已尝试排查\n1. \n2. \n3. \n\n## 希望得到的帮助\n- \n', 1, 40, 0),
(3201, '资源插件模板', 'RESOURCE', 'RESOURCE_PLUGIN', '资源名 + 主版本 + 适用端', '一句话介绍资源适合什么玩家或服务器。',
'# 资源介绍\n\n## 适用环境\n- Minecraft 版本：\n- 资源分类：插件资源\n- 推荐对象：服主 / 开发者\n\n## 资源亮点\n- \n- \n- \n\n## 使用说明\n1. \n2. \n3. \n\n## 更新日志\n```text\nv1.0.0\n- 首次发布\n```\n\n## 截图与演示\n![](在这里插入封面或截图)\n', 1, 50, 0)
ON DUPLICATE KEY UPDATE updated_at = NOW();
