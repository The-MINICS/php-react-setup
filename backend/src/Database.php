<?php

namespace App;

use PDO;
use PDOException;

class Database {
  private static $connection = null;

  public static function getConnection(): PDO {
    if (self::$connection === null) {
      try {
        // Load environment variables
        $host = getenv('DB_HOST');
        $port = getenv('DB_PORT');
        $dbname = getenv('POSTGRES_DB');
        $username = getenv('POSTGRES_USER');
        $password = getenv('POSTGRES_PASSWORD');

        $dsn = "pgsql:host={$host};port={$port};dbname={$dbname}";
        
        self::$connection = new PDO($dsn, $username, $password, [
          PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
          PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
          PDO::ATTR_EMULATE_PREPARES => false,
        ]);
      } catch (PDOException $e) {
        throw new PDOException("Database connection failed: " . $e->getMessage());
      }
    }
    return self::$connection;
  }

  public static function query(string $sql, array $params = []): array {
    try {
      $pdo = self::getConnection();
      $stmt = $pdo->prepare($sql);
      $stmt->execute($params);
      return $stmt->fetchAll();
    } catch (PDOException $e) {
      throw new PDOException("Query failed: " . $e->getMessage());
    }
  }

  public static function execute(string $sql, array $params = []): bool {
    try {
      $pdo = self::getConnection();
      $stmt = $pdo->prepare($sql);
      return $stmt->execute($params);
    } catch (PDOException $e) {
      throw new PDOException("Execute failed: " . $e->getMessage());
    }
  }

  public static function insert(string $sql, array $params = []): array {
    try {
      $pdo = self::getConnection();
      $stmt = $pdo->prepare($sql);
      $stmt->execute($params);
      return $stmt->fetch() ?: [];
    } catch (PDOException $e) {
      throw new PDOException("Insert failed: " . $e->getMessage());
    }
  }
}