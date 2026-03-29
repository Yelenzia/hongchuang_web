CREATE DATABASE IF NOT EXISTS hongchuang_platform DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE hongchuang_platform;

CREATE TABLE IF NOT EXISTS sys_user (
    id BIGINT PRIMARY KEY,
    username VARCHAR(32) NOT NULL,
    email VARCHAR(128) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'USER',
    status TINYINT NOT NULL DEFAULT 1,
    email_verified TINYINT NOT NULL DEFAULT 0,
    last_login_at DATETIME NULL,
    last_login_ip VARCHAR(64) NULL,
    register_ip VARCHAR(64) NULL,
    forum_uid BIGINT NULL,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,
    deleted TINYINT NOT NULL DEFAULT 0,
    UNIQUE KEY uk_sys_user_username (username),
    UNIQUE KEY uk_sys_user_email (email),
    UNIQUE KEY uk_sys_user_forum_uid (forum_uid),
    KEY idx_sys_user_role (role),
    KEY idx_sys_user_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS sys_sequence (
    biz_key VARCHAR(50) PRIMARY KEY,
    `last_value` BIGINT NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT IGNORE INTO sys_sequence (biz_key, `last_value`) VALUES ('forum_uid', 10000);

CREATE TABLE IF NOT EXISTS sys_user_profile (
    id BIGINT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    nickname VARCHAR(32) NOT NULL,
    avatar_url VARCHAR(255) NULL,
    signature VARCHAR(120) NULL,
    business_card VARCHAR(32) NULL,
    user_level INT NOT NULL DEFAULT 1,
    bio VARCHAR(255) NULL,
    post_count INT NOT NULL DEFAULT 0,
    comment_count INT NOT NULL DEFAULT 0,
    favorite_count INT NOT NULL DEFAULT 0,
    following_count INT NOT NULL DEFAULT 0,
    follower_count INT NOT NULL DEFAULT 0,
    like_received_count INT NOT NULL DEFAULT 0,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,
    deleted TINYINT NOT NULL DEFAULT 0,
    UNIQUE KEY uk_sys_user_profile_user_id (user_id),
    KEY idx_sys_user_profile_nickname (nickname)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS forum_board (
    id BIGINT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    slug VARCHAR(50) NOT NULL,
    description VARCHAR(255) NULL,
    icon VARCHAR(100) NULL,
    sort_order INT NOT NULL DEFAULT 0,
    post_count INT NOT NULL DEFAULT 0,
    is_public TINYINT NOT NULL DEFAULT 1,
    status TINYINT NOT NULL DEFAULT 1,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,
    deleted TINYINT NOT NULL DEFAULT 0,
    UNIQUE KEY uk_forum_board_slug (slug),
    KEY idx_forum_board_sort_order (sort_order),
    KEY idx_forum_board_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS forum_post (
    id BIGINT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    board_id BIGINT NOT NULL,
    title VARCHAR(150) NOT NULL,
    summary VARCHAR(300) NULL,
    content_md LONGTEXT NOT NULL,
    content_html LONGTEXT NULL,
    cover_url VARCHAR(255) NULL,
    view_count INT NOT NULL DEFAULT 0,
    like_count INT NOT NULL DEFAULT 0,
    favorite_count INT NOT NULL DEFAULT 0,
    comment_count INT NOT NULL DEFAULT 0,
    hot_score DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    is_top TINYINT NOT NULL DEFAULT 0,
    is_recommended TINYINT NOT NULL DEFAULT 0,
    status TINYINT NOT NULL DEFAULT 1,
    audit_status TINYINT NOT NULL DEFAULT 0,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,
    deleted TINYINT NOT NULL DEFAULT 0,
    KEY idx_forum_post_user_id (user_id),
    KEY idx_forum_post_board_id (board_id),
    KEY idx_forum_post_created_at (created_at),
    KEY idx_forum_post_status (status),
    KEY idx_forum_post_hot (like_count, comment_count, created_at),
    KEY idx_forum_post_board_sort (board_id, status, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS forum_comment (
    id BIGINT PRIMARY KEY,
    post_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    parent_id BIGINT NOT NULL DEFAULT 0,
    root_id BIGINT NOT NULL DEFAULT 0,
    reply_user_id BIGINT NULL,
    content VARCHAR(1000) NOT NULL,
    status TINYINT NOT NULL DEFAULT 1,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,
    deleted TINYINT NOT NULL DEFAULT 0,
    KEY idx_forum_comment_post_id (post_id),
    KEY idx_forum_comment_user_id (user_id),
    KEY idx_forum_comment_parent_id (parent_id),
    KEY idx_forum_comment_root_id (root_id),
    KEY idx_forum_comment_post_created (post_id, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


CREATE TABLE IF NOT EXISTS forum_post_favorite (
    id BIGINT PRIMARY KEY,
    post_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,
    deleted TINYINT NOT NULL DEFAULT 0,
    UNIQUE KEY uk_forum_post_favorite (post_id, user_id),
    KEY idx_forum_post_favorite_user (user_id, created_at),
    KEY idx_forum_post_favorite_post (post_id, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS user_follow (
    id BIGINT PRIMARY KEY,
    follower_user_id BIGINT NOT NULL,
    followee_user_id BIGINT NOT NULL,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,
    deleted TINYINT NOT NULL DEFAULT 0,
    UNIQUE KEY uk_user_follow (follower_user_id, followee_user_id),
    KEY idx_user_follow_followee (followee_user_id, created_at),
    KEY idx_user_follow_follower (follower_user_id, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS forum_post_like (
    id BIGINT PRIMARY KEY,
    post_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    created_at DATETIME NOT NULL,
    UNIQUE KEY uk_forum_post_like_user_post (user_id, post_id),
    KEY idx_forum_post_like_post_id (post_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS forum_tag (
    id BIGINT PRIMARY KEY,
    name VARCHAR(32) NOT NULL,
    slug VARCHAR(32) NOT NULL,
    post_count INT NOT NULL DEFAULT 0,
    status TINYINT NOT NULL DEFAULT 1,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,
    deleted TINYINT NOT NULL DEFAULT 0,
    UNIQUE KEY uk_forum_tag_name (name),
    UNIQUE KEY uk_forum_tag_slug (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS forum_post_tag (
    id BIGINT PRIMARY KEY,
    post_id BIGINT NOT NULL,
    tag_id BIGINT NOT NULL,
    created_at DATETIME NOT NULL,
    UNIQUE KEY uk_forum_post_tag (post_id, tag_id),
    KEY idx_forum_post_tag_tag_id (tag_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS forum_post_block (
    id BIGINT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    post_id BIGINT NOT NULL,
    created_at DATETIME NOT NULL,
    UNIQUE KEY uk_forum_post_block_user_post (user_id, post_id),
    KEY idx_forum_post_block_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS forum_report (
    id BIGINT PRIMARY KEY,
    reporter_id BIGINT NOT NULL,
    target_type VARCHAR(20) NOT NULL,
    target_id BIGINT NOT NULL,
    reason_type VARCHAR(30) NOT NULL,
    reason_detail VARCHAR(500) NULL,
    status TINYINT NOT NULL DEFAULT 1,
    handler_id BIGINT NULL,
    handle_note VARCHAR(500) NULL,
    handled_at DATETIME NULL,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,
    KEY idx_forum_report_target (target_type, target_id),
    KEY idx_forum_report_reporter_id (reporter_id),
    KEY idx_forum_report_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS cms_announcement (
    id BIGINT PRIMARY KEY,
    title VARCHAR(120) NOT NULL,
    summary VARCHAR(255) NULL,
    content LONGTEXT NOT NULL,
    is_pinned TINYINT NOT NULL DEFAULT 0,
    publish_status TINYINT NOT NULL DEFAULT 1,
    published_at DATETIME NULL,
    created_by BIGINT NULL,
    updated_by BIGINT NULL,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,
    deleted TINYINT NOT NULL DEFAULT 0,
    KEY idx_cms_announcement_publish_status (publish_status),
    KEY idx_cms_announcement_published_at (published_at),
    KEY idx_cms_announcement_is_pinned (is_pinned)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 推荐初始化板块
INSERT IGNORE INTO forum_board (id, name, slug, description, icon, sort_order, post_count, is_public, status, created_at, updated_at, deleted) VALUES
(1001, '插件资源区', 'plugin', 'Minecraft 插件资源与交流', 'Box', 1, 0, 1, 1, NOW(), NOW(), 0),
(1002, '服务器宣发区', 'server', '服务器展示、招新与宣传', 'Promotion', 2, 0, 1, 1, NOW(), NOW(), 0),
(1003, '贴图模型区', 'texture-model', '贴图、模型与美术资源', 'Picture', 3, 0, 1, 1, NOW(), NOW(), 0),
(1004, 'mod资源区', 'mod', 'MOD 分享与讨论', 'Grid', 4, 0, 1, 1, NOW(), NOW(), 0),
(1005, '玩家交流区', 'chat', '玩家日常交流、提问与讨论', 'ChatDotRound', 5, 0, 1, 1, NOW(), NOW(), 0);

-- 推荐初始化标签
INSERT IGNORE INTO forum_tag (id, name, slug, post_count, status, created_at, updated_at, deleted) VALUES
(2001, 'AI插件', 'ai-plugin', 0, 1, NOW(), NOW(), 0),
(2002, 'Minecraft', 'minecraft', 0, 1, NOW(), NOW(), 0),
(2003, '贴图', 'texture', 0, 1, NOW(), NOW(), 0),
(2004, '模型', 'model', 0, 1, NOW(), NOW(), 0),
(2005, 'MOD', 'mod', 0, 1, NOW(), NOW(), 0),
(2006, '服务器', 'server', 0, 1, NOW(), NOW(), 0),
(2007, '教程', 'tutorial', 0, 1, NOW(), NOW(), 0),
(2008, '交流', 'discussion', 0, 1, NOW(), NOW(), 0);


ALTER TABLE sys_user_profile ADD COLUMN IF NOT EXISTS signature VARCHAR(120) NULL AFTER avatar_url;

CREATE TABLE IF NOT EXISTS forum_achievement (
    id BIGINT PRIMARY KEY,
    code VARCHAR(40) NOT NULL,
    name VARCHAR(40) NOT NULL,
    description VARCHAR(255) NULL,
    icon VARCHAR(40) NULL,
    color VARCHAR(20) NULL,
    sort_order INT NOT NULL DEFAULT 0,
    status TINYINT NOT NULL DEFAULT 1,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,
    deleted TINYINT NOT NULL DEFAULT 0,
    UNIQUE KEY uk_forum_achievement_code (code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS forum_user_achievement (
    id BIGINT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    achievement_id BIGINT NOT NULL,
    obtained_at DATETIME NOT NULL,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,
    deleted TINYINT NOT NULL DEFAULT 0,
    UNIQUE KEY uk_forum_user_achievement (user_id, achievement_id),
    KEY idx_forum_user_achievement_user_id (user_id),
    KEY idx_forum_user_achievement_achievement_id (achievement_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT IGNORE INTO forum_achievement (id, code, name, description, icon, color, sort_order, status, created_at, updated_at, deleted) VALUES
(3001, 'pioneer', '开拓者', '成功注册鸿创工作室社区账号。', 'Compass', '#22c55e', 1, 1, NOW(), NOW(), 0),
(3002, 'early_supporter', '先行者', '较早加入社区，拥有稀有 UID 号段。', 'Star', '#f59e0b', 2, 1, NOW(), NOW(), 0),
(3003, 'first_post', '初次发帖', '完成了你的第一篇帖子发布。', 'EditPen', '#38bdf8', 3, 1, NOW(), NOW(), 0),
(3004, 'first_comment', '首次发言', '完成了你的第一条评论。', 'ChatDotRound', '#8b5cf6', 4, 1, NOW(), NOW(), 0),
(3005, 'creator_lv1', '创作者 I', '累计发布 3 篇帖子。', 'Box', '#06b6d4', 5, 1, NOW(), NOW(), 0),
(3006, 'communicator_lv1', '交流达人 I', '累计发布 10 条评论。', 'Message', '#ec4899', 6, 1, NOW(), NOW(), 0);
