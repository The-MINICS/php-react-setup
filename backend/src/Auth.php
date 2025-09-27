<?php

namespace App;

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class Auth
{
  private static $secret = 'your-secret-key'; // เปลี่ยนเป็น secret จริง

  public static function generateToken(array $payload): string
  {
    $payload['iat'] = time();
    $payload['exp'] = time() + 60 * 60 * 24; // 1 วัน
    return JWT::encode($payload, self::$secret, 'HS256');
  }

  public static function verifyToken(string $token): ?array
  {
    try {
      $decoded = JWT::decode($token, new Key(self::$secret, algorithm: 'HS256'));
      return (array) $decoded;
    } catch (\Exception $e) {
      return null;
    }
  }

  public static function requireAuth(): array
  {
    $authHeader = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
    if (preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
      $token = $matches[1];
      // 1. check if it's a valid JWT
      $user = self::verifyToken($token);
      if ($user) {
        return $user;
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
        // Optionally, you can generate a JWT for your own use
        $jwt = self::generateToken($userInfo);
        return ['user' => $userInfo, 'token' => $jwt];
        //return $userInfo;
      }
    }
    Response::error('Unauthorized', 401);
    exit;
  }
}