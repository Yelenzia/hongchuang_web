-- 鸿创工作室 v7 全量热修脚本
SET NAMES utf8mb4;

ALTER TABLE sys_user_profile ADD COLUMN IF NOT EXISTS signature VARCHAR(255) NULL COMMENT '个性签名' AFTER nickname;
ALTER TABLE sys_user_profile ADD COLUMN IF NOT EXISTS avatar_url VARCHAR(255) NULL COMMENT '头像' AFTER signature;
ALTER TABLE sys_user_profile ADD COLUMN IF NOT EXISTS business_card VARCHAR(32) NULL COMMENT '用户名片' AFTER signature;
ALTER TABLE sys_user_profile ADD COLUMN IF NOT EXISTS user_level INT NOT NULL DEFAULT 1 COMMENT '用户等级 1-9' AFTER business_card;
ALTER TABLE sys_user_profile ADD COLUMN IF NOT EXISTS experience_points INT NOT NULL DEFAULT 0 COMMENT '成长值' AFTER user_level;

CREATE TABLE IF NOT EXISTS user_notification (
    id BIGINT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    type VARCHAR(32) NOT NULL,
    title VARCHAR(120) NOT NULL,
    content VARCHAR(500) NOT NULL,
    is_read TINYINT NOT NULL DEFAULT 0,
    related_id BIGINT NULL,
    related_type VARCHAR(32) NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted TINYINT NOT NULL DEFAULT 0,
    KEY idx_notification_user (user_id),
    KEY idx_notification_read (user_id, is_read)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS private_message (
    id BIGINT PRIMARY KEY,
    from_user_id BIGINT NOT NULL,
    to_user_id BIGINT NOT NULL,
    content VARCHAR(1000) NOT NULL,
    is_read TINYINT NOT NULL DEFAULT 0,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted TINYINT NOT NULL DEFAULT 0,
    KEY idx_pm_pair_a (from_user_id, to_user_id),
    KEY idx_pm_pair_b (to_user_id, from_user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS user_wallet (
    id BIGINT PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    diamond INT NOT NULL DEFAULT 0,
    gold_ingot INT NOT NULL DEFAULT 0,
    iron_ingot INT NOT NULL DEFAULT 0,
    copper_ingot INT NOT NULL DEFAULT 0,
    total_check_in_days INT NOT NULL DEFAULT 0,
    streak_days INT NOT NULL DEFAULT 0,
    last_check_in_date DATE NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted TINYINT NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

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

CREATE TABLE IF NOT EXISTS shop_exchange_rule (
    id BIGINT PRIMARY KEY,
    code VARCHAR(64) NOT NULL UNIQUE,
    name VARCHAR(120) NOT NULL,
    from_currency VARCHAR(32) NOT NULL,
    from_amount INT NOT NULL,
    to_currency VARCHAR(32) NOT NULL,
    to_amount INT NOT NULL,
    daily_limit INT NOT NULL DEFAULT 999,
    status TINYINT NOT NULL DEFAULT 1,
    sort_order INT NOT NULL DEFAULT 0,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted TINYINT NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO shop_exchange_rule (id, code, name, from_currency, from_amount, to_currency, to_amount, daily_limit, status, sort_order, deleted)
SELECT 30001, 'COPPER_TO_IRON', '铜锭兑换铁锭', 'COPPER_INGOT', 100, 'IRON_INGOT', 1, 50, 1, 10, 0
WHERE NOT EXISTS (SELECT 1 FROM shop_exchange_rule WHERE code = 'COPPER_TO_IRON');

INSERT INTO shop_exchange_rule (id, code, name, from_currency, from_amount, to_currency, to_amount, daily_limit, status, sort_order, deleted)
SELECT 30002, 'IRON_TO_GOLD', '铁锭兑换金锭', 'IRON_INGOT', 10, 'GOLD_INGOT', 1, 30, 1, 20, 0
WHERE NOT EXISTS (SELECT 1 FROM shop_exchange_rule WHERE code = 'IRON_TO_GOLD');

INSERT INTO shop_exchange_rule (id, code, name, from_currency, from_amount, to_currency, to_amount, daily_limit, status, sort_order, deleted)
SELECT 30003, 'GOLD_TO_DIAMOND', '金锭兑换钻石', 'GOLD_INGOT', 10, 'DIAMOND', 1, 20, 1, 30, 0
WHERE NOT EXISTS (SELECT 1 FROM shop_exchange_rule WHERE code = 'GOLD_TO_DIAMOND');

INSERT INTO user_wallet (id, user_id, diamond, gold_ingot, iron_ingot, copper_ingot, total_check_in_days, streak_days, deleted)
SELECT (900000 + u.id), u.id, 0, 0, 0, 0, 0, 0, 0
FROM sys_user u
LEFT JOIN user_wallet w ON w.user_id = u.id
WHERE w.id IS NULL;
