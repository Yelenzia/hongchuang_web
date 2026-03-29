CREATE TABLE IF NOT EXISTS resource_category (
  id BIGINT PRIMARY KEY,
  name VARCHAR(64) NOT NULL,
  slug VARCHAR(64) NOT NULL,
  description VARCHAR(255) DEFAULT NULL,
  icon VARCHAR(128) DEFAULT NULL,
  sort_order INT DEFAULT 0,
  status TINYINT DEFAULT 1,
  resource_count INT DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted TINYINT DEFAULT 0,
  UNIQUE KEY uk_resource_category_slug (slug),
  KEY idx_resource_category_status (status, deleted)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS resource_item (
  id BIGINT PRIMARY KEY,
  user_id BIGINT NOT NULL,
  category_id BIGINT NOT NULL,
  title VARCHAR(120) NOT NULL,
  summary VARCHAR(500) DEFAULT NULL,
  content LONGTEXT,
  cover_url VARCHAR(255) DEFAULT NULL,
  current_version_id BIGINT DEFAULT NULL,
  current_version_no VARCHAR(64) DEFAULT NULL,
  mc_versions VARCHAR(255) DEFAULT NULL,
  download_type VARCHAR(16) DEFAULT 'LINK',
  download_url VARCHAR(500) DEFAULT NULL,
  file_url VARCHAR(500) DEFAULT NULL,
  view_count INT DEFAULT 0,
  download_count INT DEFAULT 0,
  like_count INT DEFAULT 0,
  favorite_count INT DEFAULT 0,
  comment_count INT DEFAULT 0,
  status TINYINT DEFAULT 0 COMMENT '0草稿 1待审核 2已发布 3已下架 4已删除',
  is_recommended TINYINT DEFAULT 0,
  audit_remark VARCHAR(500) DEFAULT NULL,
  sort_weight INT DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted TINYINT DEFAULT 0,
  KEY idx_resource_category_status (category_id, status, deleted),
  KEY idx_resource_user_status (user_id, status, deleted),
  KEY idx_resource_recommend_status (is_recommended, status, deleted),
  KEY idx_resource_created_at (created_at),
  KEY idx_resource_download_count (download_count)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS resource_version (
  id BIGINT PRIMARY KEY,
  resource_id BIGINT NOT NULL,
  version_no VARCHAR(64) NOT NULL,
  changelog TEXT,
  mc_versions VARCHAR(255) DEFAULT NULL,
  download_type VARCHAR(16) DEFAULT 'LINK',
  download_url VARCHAR(500) DEFAULT NULL,
  file_url VARCHAR(500) DEFAULT NULL,
  is_current TINYINT DEFAULT 0,
  status TINYINT DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted TINYINT DEFAULT 0,
  KEY idx_resource_version_resource_id (resource_id, deleted),
  KEY idx_resource_version_current (resource_id, is_current, deleted),
  KEY idx_resource_version_status (status, deleted)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS resource_tag_rel (
  id BIGINT PRIMARY KEY,
  resource_id BIGINT NOT NULL,
  tag_id BIGINT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted TINYINT DEFAULT 0,
  UNIQUE KEY uk_resource_tag (resource_id, tag_id),
  KEY idx_resource_tag_rel_tag (tag_id, deleted)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS resource_favorite (
  id BIGINT PRIMARY KEY,
  user_id BIGINT NOT NULL,
  resource_id BIGINT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted TINYINT DEFAULT 0,
  UNIQUE KEY uk_resource_favorite (user_id, resource_id),
  KEY idx_resource_favorite_resource (resource_id, deleted)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS resource_like (
  id BIGINT PRIMARY KEY,
  user_id BIGINT NOT NULL,
  resource_id BIGINT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted TINYINT DEFAULT 0,
  UNIQUE KEY uk_resource_like (user_id, resource_id),
  KEY idx_resource_like_resource (resource_id, deleted)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS resource_comment (
  id BIGINT PRIMARY KEY,
  resource_id BIGINT NOT NULL,
  user_id BIGINT NOT NULL,
  parent_id BIGINT DEFAULT 0,
  root_id BIGINT DEFAULT 0,
  reply_user_id BIGINT DEFAULT NULL,
  content VARCHAR(2000) NOT NULL,
  status TINYINT DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted TINYINT DEFAULT 0,
  KEY idx_resource_comment_resource (resource_id, status, deleted),
  KEY idx_resource_comment_root (root_id, deleted),
  KEY idx_resource_comment_user (user_id, deleted)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS resource_download_log (
  id BIGINT PRIMARY KEY,
  resource_id BIGINT NOT NULL,
  user_id BIGINT DEFAULT NULL,
  ip VARCHAR(64) DEFAULT NULL,
  ua VARCHAR(255) DEFAULT NULL,
  is_counted TINYINT DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted TINYINT DEFAULT 0,
  KEY idx_resource_download_resource_user (resource_id, user_id, created_at),
  KEY idx_resource_download_resource_ip (resource_id, ip, created_at),
  KEY idx_resource_download_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO resource_category (id, name, slug, description, sort_order, status, deleted)
VALUES
(2001, '插件资源', 'plugin', 'Minecraft 插件资源', 1, 1, 0),
(2002, '贴图资源', 'texture', 'Minecraft 贴图资源', 2, 1, 0),
(2003, '模型资源', 'model', 'Minecraft 模型资源', 3, 1, 0),
(2004, 'MOD 资源', 'mod', 'Minecraft MOD 资源', 4, 1, 0)
ON DUPLICATE KEY UPDATE updated_at = NOW();
