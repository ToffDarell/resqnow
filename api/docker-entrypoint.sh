#!/bin/sh
set -e

# Render provides $PORT; make Apache listen on it
PORT="${PORT:-10000}"
REPORT_EVIDENCE_ROOT="${REPORT_EVIDENCE_ROOT:-/var/www/html/storage/app/public}"
sed -ri "s/Listen 80/Listen ${PORT}/" /etc/apache2/ports.conf
sed -ri "s/<VirtualHost \*:80>/<VirtualHost *:${PORT}>/" /etc/apache2/sites-available/000-default.conf

php artisan config:clear
mkdir -p "$REPORT_EVIDENCE_ROOT"
chown www-data:www-data "$REPORT_EVIDENCE_ROOT"
php artisan migrate --force
php artisan db:seed --class=AdminSeeder --force
php artisan db:seed --class=ResponderSeeder --force
php artisan db:seed --class=ContactDirectorySeeder --force
php artisan storage:link --force || true
php artisan config:cache
php artisan route:cache

exec apache2-foreground
