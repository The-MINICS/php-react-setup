<?php

use App\Database;
use App\Response;
use App\Router;
use App\Auth;

// Get all posts with user info
Router::get('/api/posts', function () {
  Auth::requireAuth();
  try {
    $posts = Database::query(
      "
        SELECT 
          p.id,
          p.title,
          p.content,
          p.created_at,
          p.user_id,
          u.name as author_name,
          u.email as author_email
        FROM posts p 
        LEFT JOIN users u ON p.user_id = u.id 
        ORDER BY p.created_at DESC
      "
    );

    Response::success($posts, 'Posts retrieved successfully');
  } catch (Exception $e) {
    Response::serverError('Failed to retrieve posts');
  }
});

// Get all users
Router::get('/api/users', function () {
  Auth::requireAuth();
  try {
    $users = Database::query("
      SELECT id, name, email, created_at 
      FROM users 
      ORDER BY created_at DESC
    ");
    Response::success($users, 'Users retrieved successfully');
  } catch (Exception $e) {
    Response::serverError('Failed to retrieve users');
  }
});

// Get user by ID
Router::get('/api/users/{id}', function () {
  Auth::requireAuth();
  try {
    $id = Router::getParam(0);

    if (!$id || !is_numeric($id)) {
      Response::badRequest('Invalid user ID');
      return;
    }

    $users = Database::query("
      SELECT id, name, email, created_at 
      FROM users 
      WHERE id = ?
    ", [(int)$id]);

    if (empty($users)) {
      Response::notFound('User not found');
      return;
    }

    Response::success($users[0], 'User retrieved successfully');
  } catch (Exception $e) {
    Response::serverError('Failed to retrieve user');
  }
});

// Create new user
Router::post('/api/users', function () {
  Auth::requireAuth();
  try {
    $data = Router::getRequestBody();

    // Validation
    if (empty($data['name']) || empty($data['email'])) {
      Response::badRequest('Name and email are required', [
        'required_fields' => ['name', 'email']
      ]);
      return;
    }

    // Email validation
    if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
      Response::badRequest('Invalid email format');
      return;
    }

    $user = Database::insert("
      INSERT INTO users (name, email) 
      VALUES (?, ?) 
      RETURNING id, name, email, created_at
    ", [trim($data['name']), trim($data['email'])]);

    if (empty($user)) {
      Response::serverError('Failed to create user');
      return;
    }

    Response::success($user, 'User created successfully', 201);
  } catch (PDOException $e) {
    if (strpos($e->getMessage(), 'duplicate key') !== false) {
      Response::error('Email already exists', 409);
    } else {
      Response::serverError('Database error occurred');
    }
  } catch (Exception $e) {
    Response::serverError('Failed to create user');
  }
});

// Update user
Router::put('/api/users/{id}', function () {
  Auth::requireAuth();
  try {
    $id = Router::getParam(0);
    $data = Router::getRequestBody();

    if (!$id || !is_numeric($id)) {
      Response::badRequest('Invalid user ID');
      return;
    }

    // Validation
    if (empty($data['name']) || empty($data['email'])) {
      Response::badRequest('Name and email are required');
      return;
    }

    // Email validation
    if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
      Response::badRequest('Invalid email format');
      return;
    }

    $user = Database::insert(
      "
        UPDATE users 
        SET name = ?, email = ? 
        WHERE id = ? 
        RETURNING id, name, email, created_at
      ",
      [trim($data['name']), trim($data['email']), (int)$id]
    );

    if (empty($user)) {
      Response::notFound('User not found');
      return;
    }

    Response::success($user, 'User updated successfully');
  } catch (PDOException $e) {
    if (strpos($e->getMessage(), 'duplicate key') !== false) {
      Response::error('Email already exists', 409);
    } else {
      Response::serverError('Database error occurred');
    }
  } catch (Exception $e) {
    Response::serverError('Failed to update user');
  }
});

// Delete user
Router::delete('/api/users/{id}', function () {
  Auth::requireAuth();
  try {
    $id = Router::getParam(0);

    if (!$id || !is_numeric($id)) {
      Response::badRequest('Invalid user ID');
      return;
    }

    $result = Database::execute("DELETE FROM users WHERE id = ?", [(int)$id]);

    if (!$result) {
      Response::notFound('User not found');
      return;
    }

    Response::success([], 'User deleted successfully');
  } catch (Exception $e) {
    Response::serverError('Failed to delete user');
  }
});
