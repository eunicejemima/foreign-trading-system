-- Insert admin user (BCrypt hash for "admin123")
INSERT IGNORE INTO users (username, email, password, role, is_active)
VALUES (
  'admin',
  'admin@fts.com',
  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lh8i',
  'ADMIN',
  true
);
