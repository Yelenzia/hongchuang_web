USE hongchuang_platform;

CREATE TABLE IF NOT EXISTS user_login_session (
    id BIGINT PRIMARY KEY,
    session_id VARCHAR(64) NOT NULL,
    user_id BIGINT NOT NULL,
    token_hash VARCHAR(128) NOT NULL,
    device_type VARCHAR(20) NULL,
    device_name VARCHAR(120) NULL,
    browser VARCHAR(60) NULL,
    os VARCHAR(60) NULL,
    login_ip VARCHAR(64) NULL,
    last_active_at DATETIME NULL,
    expires_at DATETIME NULL,
    status TINYINT NOT NULL DEFAULT 1,
    revoked_at DATETIME NULL,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,
    deleted TINYINT NOT NULL DEFAULT 0,
    UNIQUE KEY uk_user_login_session_session_id (session_id),
    UNIQUE KEY uk_user_login_session_token_hash (token_hash),
    KEY idx_user_login_session_user_status (user_id, status, deleted),
    KEY idx_user_login_session_last_active (last_active_at),
    KEY idx_user_login_session_expires_at (expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
