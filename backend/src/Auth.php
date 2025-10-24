<?php

namespace App;

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class Auth
{
  private static $secret = null;

  private static function getSecret()
  {
    if (self::$secret === null) {
      self::$secret = getenv('JWT_SECRET');
    }
    return self::$secret;
  }

  public static function generateToken(array $payload): string
  {
    $payload['iat'] = time();
    $payload['exp'] = time() + 60 * 60 * 24; // 1 day expiration
    return JWT::encode($payload, self::getSecret(), 'HS256');
  }

  public static function verifyToken(string $token): ?array
  {
    try {
      $decoded = JWT::decode($token, new Key(self::getSecret(), 'HS256'));
      return (array) $decoded;
    } catch (\Exception $e) {
      error_log("JWT verification failed: " . $e->getMessage());
      return null;
    }
  }

  public static function requireAuth(string $role): array
  {
    $headers = getallheaders();
    $authHeader = $_SERVER['HTTP_AUTHORIZATION'] ?? ($headers['Authorization'] ?? '');
    if (preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
      $token = $matches[1];

      // 1. check if it's a valid JWT
      $user = self::verifyToken($token);
      if ($user) {
        // check role here
        if (isset($user['role']) && ($user['role'] === 'admin' || $user['role'] === $role)) {
          return $user;
        } else {
          error_log("Forbidden: insufficient role (" . ($user['role'] ?? 'none') . ")");
          Response::error('Forbidden: insufficient role', 403);
          exit;
        }
      }

      // 2. check token with HelpDesk
      $helpdeskApiUrl = 'https://helpdesk.example.com/api/validate-token';
      $ch = curl_init($helpdeskApiUrl);
      curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
      curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Authorization: Bearer ' . $token
      ]);
      $response = curl_exec($ch);
      $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
      curl_close($ch);
      if ($httpCode === 200) {
        $userInfo = json_decode($response, true);
        // check role here
        if (isset($userInfo['role']) && ($userInfo['role'] === 'admin' || $userInfo['role'] === $role)) {
          $jwt = self::generateToken($userInfo);
          return ['user' => $userInfo, 'token' => $jwt];
        } else {
          error_log("Forbidden: insufficient role (" . ($userInfo['role'] ?? 'none') . ")");
          Response::error('Forbidden: insufficient role', 403);
          exit;
        }
      }
    }
    error_log("Unauthorized: no valid token");
    Response::error('Unauthorized', 401);
    exit;
  }
}
