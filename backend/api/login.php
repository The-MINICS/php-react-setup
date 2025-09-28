<?php

use App\Router;
use App\Response;
use App\Database;
use App\Auth;

Router::post('/api/auth/login', function () {
  $body = Router::getRequestBody();
  //file_put_contents('/tmp/myapp.log', "Body debug: " . print_r($body, true) . PHP_EOL, FILE_APPEND);

  $username = $body['username'] ?? '';
  $password = $body['password'] ?? '';

  $user = Database::query('SELECT * FROM users WHERE username = ?', [$username]);
  if ($user && password_verify($password, $user[0]['password_hash'])) {
    $payload = [
      'id' => $user[0]['id'],
      'role' => $user[0]['role']
    ];
    $token = Auth::generateToken($payload);
    Response::success([
      'success' => true,
      'message' => 'Login successful',
      'name' => $user[0]['full_name'],
      'token' => $token
    ]);
  } else {
    Response::error('Invalid credentials', 401);
  }
});