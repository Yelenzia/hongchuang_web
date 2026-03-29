-- v8.1 热修复：头像访问、签到日志、成长字段
SET NAMES utf8mb4;

CREATE TABLE IF NOT EXISTS user_wallet_log (
    id BIGINT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    currency_type VARCHAR(32) NOT NULL,
    change_amount INT NOT NULL,
    balance_after INT NOT NULL,
    biz_type VARCHAR(32) NOT NULL,
    remark VARCHAR(255) NULL,
    related_id BIGINT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted TINYINT NOT NULL DEFAULT 0,
    KEY idx_wallet_log_user (user_id, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS user_check_in (
    id BIGINT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    check_in_date DATE NOT NULL,
    reward_currency VARCHAR(32) NOT NULL,
    reward_amount INT NOT NULL,
    streak_day INT NOT NULL DEFAULT 1,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted TINYINT NOT NULL DEFAULT 0,
    UNIQUE KEY uk_checkin_user_date (user_id, check_in_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

ALTER TABLE user_check_in ADD COLUMN IF NOT EXISTS streak_day INT NOT NULL DEFAULT 1 AFTER reward_amount;
ALTER TABLE sys_user_profile ADD COLUMN IF NOT EXISTS experience_points INT NOT NULL DEFAULT 0 AFTER user_level;
UPDATE sys_user_profile SET experience_points = 0 WHERE experience_points IS NULL;
