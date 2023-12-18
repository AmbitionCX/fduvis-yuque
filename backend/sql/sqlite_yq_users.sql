CREATE TABLE IF NOT EXISTS yq_users (
user_name TEXT,
user_id INTEGER NOT NULL PRIMARY KEY,
user_login TEXT NOT NULL,
user_wallet TEXT,
user_balance INTEGER
)