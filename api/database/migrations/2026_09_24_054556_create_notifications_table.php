<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('notifications', function (Blueprint $table) {
            $table->id();

            $table->string('type');

            $table->string('title');

            $table->text('message');

            $table->foreignId('target_user_id')
                ->constrained('users')
                ->cascadeOnDelete();

            $table->boolean('is_read')->default(false);

            $table->timestamps();

            $table->index(['target_user_id', 'is_read']);
            $table->index('type');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('notifications');
    }
};