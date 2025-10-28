<?php

use App\Router;
use App\Response;
use App\Database;
use App\Auth;

Router::post('/api/auth/login', function () {
  $body = Router::getRequestBody();

  $username = $body['username'] ?? '';
  $password = $body['password'] ?? '';

  $user = Database::query('SELECT * FROM users WHERE username = ?', [$username]);
  if ($user && password_verify($password, $user[0]['password_hash'])) {
    $payload = [
      'id' => $user[0]['id'],
      'role' => $user[0]['role'],
      'name' => $user[0]['full_name'],
      'iat' => time(),
      'exp' => time() + 86400 // Token valid for 1 day
    ];
    $token = Auth::generateToken($payload);
    Response::success([
      'success' => true,
      'message' => 'Login successful',
      'token' => $token
    ]);
  } else {
    Response::error('Invalid credentials', 401);
  }
});