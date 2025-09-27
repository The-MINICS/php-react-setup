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
  ('admin', 'admin_hash', 'Admin User', 'admin@example.com', 'admin'),
  ('editor', 'editor_hash', 'Editor User', 'editor@example.com', 'editor'),
  ('user1', 'user1_hash', 'User One', 'user1@example.com', 'user');

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