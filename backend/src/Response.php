<?php

namespace App;

class Response {
  // for CORS handling, uncomment if needed (production should handle CORS differently)
  // private static $corsHeaders = [
  //   'Access-Control-Allow-Origin' => 'http://localhost:5173',
  //   'Access-Control-Allow-Methods' => 'GET, POST, PUT, DELETE, OPTIONS',
  //   'Access-Control-Allow-Headers' => 'Content-Type, Authorization, X-Requested-With',
  //   'Access-Control-Allow-Credentials' => 'true'
  // ];

  // private static function setCorsHeaders(): void {
  //   foreach (self::$corsHeaders as $header => $value) {
  //     header("$header: $value");
  //   }
  // }

  public static function json(array $data, int $statusCode = 200): void {
    http_response_code($statusCode);
    //self::setCorsHeaders();
    header('Content-Type: application/json');
    echo json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    exit;
  }

  public static function success(array $data = [], string $message = 'Success', int $statusCode = 200): void {
    self::json([
      'success' => true,
      'message' => $message,
      'data' => $data
    ], $statusCode);
  }

  public static function error(string $message = 'Error occurred', int $statusCode = 400, array $details = []): void {
    $response = [
      'success' => false,
      'message' => $message
    ];
    
    if (!empty($details)) {
      $response['details'] = $details;
    }
    
    self::json($response, $statusCode);
  }

  public static function notFound(string $message = 'Resource not found'): void {
    self::error($message, 404);
  }

  public static function badRequest(string $message = 'Bad request', array $validation = []): void {
    self::error($message, 400, $validation);
  }

  public static function serverError(string $message = 'Internal server error'): void {
    self::error($message, 500);
  }
}