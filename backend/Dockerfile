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

# Minimal CORS config for development
RUN printf '%s\n' \
'<Directory /var/www/html>' \
'    AllowOverride All' \
'    Require all granted' \
'    <IfModule mod_headers.c>' \
'        Header always set Access-Control-Allow-Origin "*"' \
'        Header always set Access-Control-Allow-Methods "GET, POST, PUT, PATCH, DELETE, OPTIONS"' \
'        Header always set Access-Control-Allow-Headers "Content-Type, Authorization, X-Requested-With"' \
'        Header always set Access-Control-Allow-Credentials "true"' \
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