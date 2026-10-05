<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('resqnow_announcements', function (Blueprint $table) {
            $table->unsignedBigInteger('published_by')->nullable()->change();
        });
    }

    public function down(): void
    {
        Schema::table('resqnow_announcements', function (Blueprint $table) {
            $table->unsignedBigInteger('published_by')->nullable(false)->change();
        });
    }
};
