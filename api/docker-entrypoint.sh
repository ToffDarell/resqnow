#!/bin/sh
set -e

# Render provides $PORT; make Apache listen on it
PORT="${PORT:-10000}"
sed -ri "s/Listen 80/Listen ${PORT}/" /etc/apache2/ports.conf
sed -ri "s/<VirtualHost \*:80>/<VirtualHost *:${PORT}>/" /etc/apache2/sites-available/000-default.conf

php artisan config:clear
php artisan migrate --force
php artisan db:seed --class=AdminSeeder --force
php artisan db:seed --class=ResponderSeeder --force
php artisan db:seed --class=ContactDirectorySeeder --force
php artisan storage:link || true
php artisan config:cache
php artisan route:cache

exec apache2-foreground
