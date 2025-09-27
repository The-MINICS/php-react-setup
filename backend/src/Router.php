<?php

namespace App;

class Router {
  private static $routes = [];
  private static $method;
  private static $uri;

  public static function init(): void {
    self::$method = $_SERVER['REQUEST_METHOD'];
    self::$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
    
    // Remove trailing slash
    self::$uri = rtrim(self::$uri, '/') ?: '/';
  }

  public static function get(string $path, callable $callback): void {
    self::addRoute('GET', $path, $callback);
  }

  public static function post(string $path, callable $callback): void {
    self::addRoute('POST', $path, $callback);
  }

  public static function put(string $path, callable $callback): void {
    self::addRoute('PUT', $path, $callback);
  }

  public static function delete(string $path, callable $callback): void {
    self::addRoute('DELETE', $path, $callback);
  }

  public static function options(string $path, callable $callback): void {
    self::addRoute('OPTIONS', $path, $callback);
  }

  private static function addRoute(string $method, string $path, callable $callback): void {
    // Remove trailing slash from path
    $path = rtrim($path, '/') ?: '/';
    self::$routes[$method][$path] = $callback;
  }

  public static function run(): void  {
    if (!isset(self::$routes[self::$method])) {
      Response::error('Method not allowed', 405);
      return;
    }

    $routes = self::$routes[self::$method];
    
    // Exact match first
    if (isset($routes[self::$uri])) {
      $routes[self::$uri]();
      return;
    }

    // Pattern matching for parameters
    foreach ($routes as $pattern => $callback) {
      if (self::matchRoute($pattern, self::$uri)) {
        $callback();
        return;
      }
    }

    Response::notFound('Endpoint not found');
  }

  private static function matchRoute(string $pattern, string $uri): bool {
    // Convert route pattern to regex
    $pattern = preg_replace('/\{([^}]+)\}/', '([^/]+)', $pattern);
    $pattern = str_replace('/', '\/', $pattern);
    $pattern = '/^' . $pattern . '$/';
    
    if (preg_match($pattern, $uri, $matches)) {
      // Store parameters in global variable for access in route handlers
      array_shift($matches); // Remove full match
      $GLOBALS['route_params'] = $matches;
      return true;
    }
    
    return false;
  }

  public static function getParam(int $index): ?string {
    return $GLOBALS['route_params'][$index] ?? null;
  }

  public static function getRequestBody(): array {
    $input = file_get_contents('php://input');
    return json_decode($input, true) ?: [];
  }
}