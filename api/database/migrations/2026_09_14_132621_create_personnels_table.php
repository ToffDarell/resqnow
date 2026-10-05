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
    Schema::create('personnels', function (Blueprint $table) {
        $table->id();

        $table->string('personnel_code')->unique();

        $table->string('name');

        $table->string('role');

        $table->string('team')->nullable();

        $table->string('mobile')->nullable();

        $table->string('status')->default('Active');

        $table->string('availability')->default('Available');

        $table->string('assignment')->nullable();

        $table->string('location')->nullable();

        $table->timestamp('joined_at')->nullable();

        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('personnels');
    }
};
