FROM php:8.2-apache

# Install system dependencies
RUN apt-get update && apt-get install -y \
  git \
  curl \
  libpng-dev \
  libonig-dev \
  libxml2-dev \
  zip \
  unzip \
  libpq-dev \
  && rm -rf /var/lib/apt/lists/*

# Install PHP extensions
RUN docker-php-ext-install pdo pdo_pgsql mbstring

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Enable Apache modules
RUN a2enmod rewrite headers

# Create a dedicated CORS config (avoid appending to apache2.conf)
# - AllowOverride All so .htaccess works
# - Strict origin (http://localhost:5173) + credentials
# - Handle OPTIONS preflight with 204
RUN printf '%s\n' \
'<Directory /var/www/html>' \
'    AllowOverride All' \
'    Require all granted' \
'    # Only allow this exact origin (safe for credentials)' \
'    SetEnvIfNoCase Origin "^http://localhost:5173$" CORSSafeOrigin=1' \
'' \
'    <IfModule mod_headers.c>' \
'        Header always set Access-Control-Allow-Origin "%{Origin}e" env=CORSSafeOrigin' \
'        Header always set Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS"' \
'        Header always set Access-Control-Allow-Headers "Content-Type, Authorization, X-Requested-With"' \
'        Header always set Access-Control-Allow-Credentials "true"' \
'    </IfModule>' \
'' \
'    # Preflight: reply 204 for OPTIONS (no body)' \
'    <IfModule mod_rewrite.c>' \
'        RewriteEngine On' \
'        RewriteCond %{REQUEST_METHOD} =OPTIONS' \
'        RewriteRule ^ - [R=204,L]' \
'    </IfModule>' \
'</Directory>' \
> /etc/apache2/conf-available/cors.conf \
&& a2enconf cors

# Set working directory
WORKDIR /var/www/html

# Copy composer files first for better Docker layer caching
COPY composer.json composer.lock* ./

# Install dependencies
RUN composer install --no-dev --optimize-autoloader --no-interaction || true

# Copy source code
COPY . .

# Set proper permissions
RUN chown -R www-data:www-data /var/www/html \
  && chmod -R 755 /var/www/html

EXPOSE 80