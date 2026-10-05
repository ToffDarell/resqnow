<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('responder_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')
                ->unique()
                ->constrained('users')
                ->cascadeOnDelete();
            $table->boolean('is_on_duty')->default(false)->index();
            $table->string('responder_role', 80)->nullable();
            $table->string('current_asset', 120)->nullable();
            $table->string('team_name', 120)->nullable();
            $table->timestamp('last_duty_changed_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('responder_profiles');
    }
};
