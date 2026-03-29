USE hongchuang_platform;

ALTER TABLE sys_user_profile
  ADD COLUMN IF NOT EXISTS signature VARCHAR(120) NULL AFTER avatar_url,
  ADD COLUMN IF NOT EXISTS business_card VARCHAR(32) NULL AFTER signature,
  ADD COLUMN IF NOT EXISTS user_level INT NOT NULL DEFAULT 1 AFTER business_card;

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
(3006, 'communicator_lv1', '交流达人 I', '累计发布 10 条评论。', 'Message', '#ec4899', 6, 1, NOW(), NOW(), 0),
(3007, 'REGISTER', '开拓者（大写兼容）', '用于兼容旧版自动触发编码。', 'Compass', '#22c55e', 101, 1, NOW(), NOW(), 0),
(3008, 'EARLY_BIRD', '先行者（大写兼容）', '用于兼容旧版自动触发编码。', 'Star', '#f59e0b', 102, 1, NOW(), NOW(), 0),
(3009, 'FIRST_POST', '初次发帖（大写兼容）', '用于兼容旧版自动触发编码。', 'EditPen', '#38bdf8', 103, 1, NOW(), NOW(), 0),
(3010, 'FIRST_COMMENT', '首次发言（大写兼容）', '用于兼容旧版自动触发编码。', 'ChatDotRound', '#8b5cf6', 104, 1, NOW(), NOW(), 0),
(3011, 'POST_3', '创作者 I（大写兼容）', '用于兼容旧版自动触发编码。', 'Box', '#06b6d4', 105, 1, NOW(), NOW(), 0),
(3012, 'COMMENT_10', '交流达人 I（大写兼容）', '用于兼容旧版自动触发编码。', 'Message', '#ec4899', 106, 1, NOW(), NOW(), 0);

UPDATE sys_user_profile SET user_level = 1 WHERE user_level IS NULL OR user_level < 1;
UPDATE sys_user_profile SET business_card = 'BOSS', user_level = 9 WHERE user_id IN (SELECT id FROM sys_user WHERE role = 'ADMIN');
