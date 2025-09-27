--- create ENUM for user role ---
CREATE TYPE user_role AS ENUM ('admin', 'editor', 'user');

--- create ENUM for post status ---
CREATE TYPE post_status AS ENUM ('draft', 'published', 'archived');

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  provider_url VARCHAR(100) UNIQUE,
  role user_role DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  content TEXT,
  user_id INTEGER REFERENCES users(id),
  status post_status DEFAULT 'draft',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE comments (
  id SERIAL PRIMARY KEY,
  content TEXT NOT NULL,
  post_id INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE post_categories (
  post_id INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  category_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, category_id)
);

-- Insert initial users
INSERT INTO users (username, password_hash, full_name, email, role)
VALUES
  ('admin', '$2y$10$5v.xwUj6GpHrfI4UEHAfeukXiRAIiDNoOaed3p6TW2ltvzQJRwuxi', 'Admin User', 'admin@example.com', 'admin'), --password=admin123
  ('editor', '$2y$10$sojpkfI4CgTwv2D8zXN7FeZgrTuj3SrXA79i5ZIChANL3f.f7fHW.', 'Editor User', 'editor@example.com', 'editor'), ---password=editor123
  ('user1', '$2y$10$./KHaZRPeZ7zEhFVKv.07.n3PK/yXNMComlSg72pbhvywhwMPUT9u', 'User One', 'user1@example.com', 'user'); ---password=user123
  --- Passwords are hashed versions of 'admin123', 'editor123', and 'user123' respectively.
  --- In a real application, use a secure method to generate and store passwords. 
  --- For PHP, you can use password_hash('your_password', PASSWORD_DEFAULT); or PHP CLI you can run the following command in terminal:
  --- php -r "echo password_hash('your_password', PASSWORD_DEFAULT);"

-- Insert initial categories
INSERT INTO categories (name)
VALUES
  ('Technology'),
  ('Lifestyle'),
  ('Education');

-- Insert initial posts
INSERT INTO posts (title, content, user_id, status)
VALUES
  ('Welcome Post', 'This is the first post.', 1, 'published'),
  ('Tech Trends', 'Latest trends in tech.', 2, 'draft');

-- Insert initial comments
INSERT INTO comments (content, post_id, user_id)
VALUES
  ('Great post!', 1, 3),
  ('Looking forward to more.', 1, 2);

-- Insert initial post_categories
INSERT INTO post_categories (post_id, category_id)
VALUES
  (1, 1),
  (1, 2),
  (2, 1);