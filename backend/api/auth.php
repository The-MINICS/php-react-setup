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
      'username' => $user[0]['username'],
      'role' => $user[0]['role']
    ];
    $token = Auth::generateToken($payload);
    Response::success(['token' => $token, 'user' => $payload]);
  } else {
    Response::error('Invalid credentials', 401);
  }
});