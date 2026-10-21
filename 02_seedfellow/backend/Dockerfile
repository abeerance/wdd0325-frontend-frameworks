# Dockerfile
FROM php:8.5.10-fpm-alpine

# pdo_pgsql talks to PostgreSQL; intl is what `php artisan db:table` formats its sizes with.
RUN apk add --no-cache icu-dev postgresql-dev \
 && docker-php-ext-install intl pdo_pgsql

COPY --from=composer:2.10.3 /usr/bin/composer /usr/local/bin/composer

WORKDIR /var/www/html
