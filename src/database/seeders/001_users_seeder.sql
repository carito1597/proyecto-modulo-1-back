-- Insert test users
INSERT INTO users (name, email, password) VALUES
    ('Test User 1', 'test1@example.com', 'password123'),
    ('Test User 2', 'test2@example.com', 'password123')
ON CONFLICT (email) DO NOTHING; 