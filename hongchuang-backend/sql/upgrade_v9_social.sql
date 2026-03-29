-- 鸿创工作室 v9 社区互动闭环升级脚本
SET NAMES utf8mb4;
USE hongchuang_platform;

ALTER TABLE forum_post
    ADD COLUMN IF NOT EXISTS favorite_count INT NOT NULL DEFAULT 0 AFTER like_count;

ALTER TABLE sys_user_profile
    ADD COLUMN IF NOT EXISTS favorite_count INT NOT NULL DEFAULT 0 AFTER comment_count,
    ADD COLUMN IF NOT EXISTS following_count INT NOT NULL DEFAULT 0 AFTER favorite_count,
    ADD COLUMN IF NOT EXISTS follower_count INT NOT NULL DEFAULT 0 AFTER following_count;

CREATE TABLE IF NOT EXISTS forum_post_favorite (
    id BIGINT PRIMARY KEY,
    post_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted TINYINT NOT NULL DEFAULT 0,
    UNIQUE KEY uk_forum_post_favorite (post_id, user_id),
    KEY idx_forum_post_favorite_user (user_id, created_at),
    KEY idx_forum_post_favorite_post (post_id, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS user_follow (
    id BIGINT PRIMARY KEY,
    follower_user_id BIGINT NOT NULL,
    followee_user_id BIGINT NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted TINYINT NOT NULL DEFAULT 0,
    UNIQUE KEY uk_user_follow (follower_user_id, followee_user_id),
    KEY idx_user_follow_followee (followee_user_id, created_at),
    KEY idx_user_follow_follower (follower_user_id, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

UPDATE sys_user_profile p
LEFT JOIN (
    SELECT user_id, COUNT(*) AS cnt
    FROM forum_post_favorite
    WHERE deleted = 0
    GROUP BY user_id
) f ON f.user_id = p.user_id
SET p.favorite_count = COALESCE(f.cnt, 0);

UPDATE sys_user_profile p
LEFT JOIN (
    SELECT follower_user_id AS user_id, COUNT(*) AS cnt
    FROM user_follow
    WHERE deleted = 0
    GROUP BY follower_user_id
) f ON f.user_id = p.user_id
SET p.following_count = COALESCE(f.cnt, 0);

UPDATE sys_user_profile p
LEFT JOIN (
    SELECT followee_user_id AS user_id, COUNT(*) AS cnt
    FROM user_follow
    WHERE deleted = 0
    GROUP BY followee_user_id
) f ON f.user_id = p.user_id
SET p.follower_count = COALESCE(f.cnt, 0);

UPDATE forum_post p
LEFT JOIN (
    SELECT post_id, COUNT(*) AS cnt
    FROM forum_post_favorite
    WHERE deleted = 0
    GROUP BY post_id
) f ON f.post_id = p.id
SET p.favorite_count = COALESCE(f.cnt, 0);
