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
        Schema::create('resident_profiles', function (Blueprint $table) {
            $table->id();

            // One resident profile per user
            $table
                ->foreignId('user_id')
                ->unique()
                ->constrained()
                ->cascadeOnDelete();

            // Resident contact information
            $table
                ->string('contact_number', 20);

            $table
                ->string('purok', 100);

            $table
                ->text('address');

            // Household information
            $table
                ->unsignedInteger('household_count')
                ->default(1);

            $table
                ->boolean('has_senior_citizen')
                ->default(false);

            $table
                ->boolean('has_child')
                ->default(false);

            $table
                ->boolean('has_pwd')
                ->default(false);

            $table
                ->boolean('has_pregnant_person')
                ->default(false);

            // Home GPS coordinates
            // Nullable until real map/GPS setup is connected
            $table
                ->decimal('home_latitude', 10, 7)
                ->nullable();

            $table
                ->decimal('home_longitude', 10, 7)
                ->nullable();

            $table->timestamps();

            // Frequently searched barangay field
            $table->index('purok');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists(
            'resident_profiles'
        );
    }
};
