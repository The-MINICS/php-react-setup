<?php
// Autoload dependencies
require_once __DIR__ . '/vendor/autoload.php';

// Import necessary classes
use App\Database;
use App\Response;
use App\Router;

// Initialize router
Router::init();

// Set error handler
set_error_handler(function($severity, $message) {
  if (error_reporting() & $severity) {
    Response::serverError("Server error: {$message}");
  }
});

// Set exception handler
set_exception_handler(function($exception) {
  Response::serverError("Server error: " . $exception->getMessage());
});

// Health check
Router::get('/api/health', function() {
  try {
    Database::query("SELECT 1");
    Response::success([
      'status' => 'healthy',
      'database' => 'connected',
      'timestamp' => date('Y-m-d H:i:s')
    ]);
  } catch (Exception $e) {
    Response::error('Database connection failed', 500, [
      'database' => 'disconnected',
      'error' => $e->getMessage()
    ]);
  }
});

// Include API route files
require_once __DIR__ . '/api/user.php';
require_once __DIR__ . '/api/login.php';
require_once __DIR__ . '/api/post.php';

// Run the router
Router::run();