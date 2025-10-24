<?php

use App\Router;
use App\Response;
use App\Database;
use App\Auth;

// Get all posts (protected)
Router::get('/api/posts', function () {
  Auth::requireAuth('user');
  $posts = Database::query('SELECT * FROM posts ORDER BY created_at DESC');
  Response::success($posts);
});

// Get single post (protected)
Router::get('/api/posts/:id', function () {
  Auth::requireAuth('user');
  $id = Router::getParam(0);
  $post = Database::query('SELECT * FROM posts WHERE id = ?', [$id]);
  if ($post) {
    Response::success($post[0]);
  } else {
    Response::notFound();
  }
});

// Create post (protected)
Router::post('/api/posts', function () {
  $user = Auth::requireAuth('user');
  $body = Router::getRequestBody();
  $title = $body['title'] ?? '';
  $content = $body['content'] ?? '';
  $status = $body['status'] ?? 'draft';

  $result = Database::insert(
    'INSERT INTO posts (title, content, user_id, status) VALUES (?, ?, ?, ?) RETURNING *',
    [$title, $content, $user['id'], $status]
  );
  Response::success($result, 'Post created', 201);
});

// Update post (protected)
Router::put('/api/posts/:id', function () {
  $user = Auth::requireAuth('user');
  $id = Router::getParam(0);
  $body = Router::getRequestBody();
  $title = $body['title'] ?? '';
  $content = $body['content'] ?? '';
  $status = $body['status'] ?? 'draft';

  // Optional: ตรวจสอบว่า user เป็นเจ้าของ post หรือเป็น admin
  Database::execute(
    'UPDATE posts SET title = ?, content = ?, status = ? WHERE id = ?',
    [$title, $content, $status, $id]
  );
  $post = Database::query('SELECT * FROM posts WHERE id = ?', [$id]);
  Response::success($post[0], 'Post updated');
});

// Delete post (protected)
Router::delete('/api/posts/:id', function () {
  Auth::requireAuth('user');
  $id = Router::getParam(0);
  Database::execute('DELETE FROM posts WHERE id = ?', [$id]);
  Response::success([], 'Post deleted');
});