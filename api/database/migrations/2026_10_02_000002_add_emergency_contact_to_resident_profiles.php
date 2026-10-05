<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasColumn('resident_profiles', 'emergency_contact_name')) {
            Schema::table('resident_profiles', function (Blueprint $table) {
                $table->string('emergency_contact_name', 150)->nullable();
            });
        }

        if (! Schema::hasColumn('resident_profiles', 'emergency_contact_number')) {
            Schema::table('resident_profiles', function (Blueprint $table) {
                $table->string('emergency_contact_number', 20)->nullable();
            });
        }
    }

    public function down(): void
    {
        // No-op: may hold production data.
    }
};
