<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('report_status_logs', function (Blueprint $table) {
            $table->string('activity', 120)->nullable();
            $table->json('checklist')->nullable();
            $table->string('photo_path')->nullable();
            $table->uuid('client_request_id')->nullable()->unique();
        });
    }

    public function down(): void
    {
        Schema::table('report_status_logs', function (Blueprint $table) {
            $table->dropUnique(['client_request_id']);

            $table->dropColumn([
                'activity',
                'checklist',
                'photo_path',
                'client_request_id',
            ]);
        });
    }
};
