<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('audit_logs', function (Blueprint $table) {
            $table->id();

            // What happened
            $table->string('action');

            // Module/category where the action happened
            $table->string('category');

            // Record affected by the action
            $table->string('target')->nullable();

            // Specific field that changed
            $table->string('field')->nullable();

            // Before and after values
            $table->text('old_value')->nullable();
            $table->text('new_value')->nullable();

            // Explanation/details of the action
            $table->text('remarks')->nullable();

            // Person who performed the action
            $table->string('user_name')->nullable();
            $table->string('user_role')->nullable();

            // Result of the action
            $table->string('status')->default('Success');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('audit_logs');
    }
};