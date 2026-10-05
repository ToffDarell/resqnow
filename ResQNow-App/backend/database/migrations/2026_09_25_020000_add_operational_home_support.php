<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('resqnow_announcements', function (Blueprint $table) {
            $table->string('category', 16)->default('general')->after('body');
            $table->json('affected_puroks')->nullable()->after('category');
            $table->timestamp('expires_at')->nullable()->after('affected_puroks');
            $table->boolean('is_active')->default(true)->after('expires_at');
            $table->index(['is_active', 'published_at'], 'announcements_active_published_idx');
            $table->index(['category', 'is_active'], 'announcements_category_active_idx');
        });

        Schema::create('resqnow_evacuation_centers', function (Blueprint $table) {
            $table->id();
            $table->string('name', 160);
            $table->string('address', 255);
            $table->decimal('latitude', 10, 7)->nullable();
            $table->decimal('longitude', 10, 7)->nullable();
            $table->string('status', 16)->default('standby');
            $table->unsignedInteger('capacity')->nullable();
            $table->unsignedInteger('current_occupancy')->nullable();
            $table->string('contact_number', 32)->nullable();
            $table->text('notes')->nullable();
            $table->boolean('is_active')->default(true);
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();

            $table->index(['is_active', 'status']);
            $table->index(['latitude', 'longitude']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('resqnow_evacuation_centers');

        Schema::table('resqnow_announcements', function (Blueprint $table) {
            $table->dropIndex('announcements_active_published_idx');
            $table->dropIndex('announcements_category_active_idx');
            $table->dropColumn([
                'category',
                'affected_puroks',
                'expires_at',
                'is_active',
            ]);
        });
    }
};
