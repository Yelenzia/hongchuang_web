USE hongchuang_platform;

CREATE TABLE IF NOT EXISTS cms_site_page (
  id BIGINT PRIMARY KEY,
  page_code VARCHAR(50) NOT NULL,
  page_name VARCHAR(80) NOT NULL,
  title VARCHAR(150) DEFAULT NULL,
  subtitle VARCHAR(500) DEFAULT NULL,
  content_json LONGTEXT NOT NULL,
  status TINYINT DEFAULT 1,
  sort_order INT DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted TINYINT DEFAULT 0,
  UNIQUE KEY uk_cms_site_page_code (page_code),
  KEY idx_cms_site_page_status (status, sort_order, deleted)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO cms_site_page (id, page_code, page_name, title, subtitle, content_json, status, sort_order, deleted)
SELECT 4201, 'HOME', '官网首页', '让 AI 真正服务 Minecraft 创作与社区协作', '鸿创工作室以 AI + Minecraft 为核心方向，正在推进 AI 模型、AI 贴图、AI 插件平台与创作者社区建设，为玩家、服主与开发者提供更高效、更智能的创作体验。',
'{"badgeText":"AI + Minecraft Studio","heroTitle":"让 AI 真正服务 Minecraft 创作与社区协作","heroSubtitle":"鸿创工作室以 AI + Minecraft 为核心方向，正在推进 AI 模型、AI 贴图、AI 插件平台与创作者社区建设，为玩家、服主与开发者提供更高效、更智能的创作体验。未来 AI 模型平台、AI 贴图平台、AI 插件平台即将上线，为玩家、服主与开发者提供更高效、更智能的创作体验。","heroButtons":[{"text":"进入论坛","link":"/forum","type":"primary"},{"text":"签到与商店","link":"/me/wallet","type":"plain"},{"text":"了解更多","link":"/contact","type":"plain"}],"directions":[{"name":"AI模型","desc":"智能生成、推理与内容创作能力整合。","style":"grass"},{"name":"AI贴图","desc":"服务贴图、模型与视觉资产创作场景。","style":"stone"},{"name":"AI插件平台","desc":"为服主与开发者提供更高效的插件生态入口。","style":"grass"},{"name":"签到与货币","desc":"每日签到可获铜锭，并可在商店内兑换更高等级货币。","style":"ore"}],"capabilities":[{"title":"AI模型","desc":"面向内容创作、资源生成与创意辅助场景的模型能力预留。"},{"title":"AI贴图","desc":"适配 Minecraft 风格素材产出与视觉资产管理。"},{"title":"AI插件平台","desc":"面向开发者与服主的插件分发、展示与社区讨论入口。"},{"title":"社区成长系统","desc":"支持等级、成就、签到、消息提醒与商店兑换。"}]}'
, 1, 10, 0
WHERE NOT EXISTS (SELECT 1 FROM cms_site_page WHERE page_code = 'HOME');

INSERT INTO cms_site_page (id, page_code, page_name, title, subtitle, content_json, status, sort_order, deleted)
SELECT 4202, 'CONTACT', '团队联系', '团队联系', '如果您有需要，可通过以下方式联系我们。技术部成员信息已重新整理排版。',
'{"qqGroup":"856418269","ownerEmail":"2930255795@qq.com","brandText":"鸿创工作室 · AI + MC 创作与社区平台","copyrightText":"© 2026 鸿创工作室. All Rights Reserved.","members":[{"name":"叶子","contact":"邮箱：Yelenas@qq.com"},{"name":"蓝技术","contact":"邮箱：1738964540@qq.com"},{"name":"flyer技术","contact":"微信：xin99666666666"},{"name":"Aufransi","contact":"邮箱：hsoooma@163.com"},{"name":"MC_NianGao","contact":"邮箱：1755722148@qq.com"},{"name":"喵喵","contact":"邮箱：2128579278@qq.com"}]}'
, 1, 20, 0
WHERE NOT EXISTS (SELECT 1 FROM cms_site_page WHERE page_code = 'CONTACT');
