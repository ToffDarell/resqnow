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
        Schema::create('system_settings', function (Blueprint $table) {
            $table->id();

            $table->string('system_name')->default('ResQNow');

            $table->string('barangay_name')
                ->default('Barangay Camunatan');

            $table->string('city_name')
                ->default('City of Ilagan');

            $table->string('language')
                ->default('English');

            $table->boolean('notifications')
                ->default(true);

            $table->boolean('critical_alerts')
                ->default(true);

            $table->boolean('assignment_alerts')
                ->default(true);

            $table->boolean('announcement_alerts')
                ->default(true);

            $table->boolean('auto_refresh')
                ->default(true);

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('system_settings');
    }
};