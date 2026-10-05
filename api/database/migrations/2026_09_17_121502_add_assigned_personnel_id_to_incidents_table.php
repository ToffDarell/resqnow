<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('incidents', function (Blueprint $table) {
            $table->foreignId('assigned_personnel_id')
                ->nullable()
                ->after('priority')
                ->constrained('personnels')
                ->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('incidents', function (Blueprint $table) {
            $table->dropForeign(['assigned_personnel_id']);
            $table->dropColumn('assigned_personnel_id');
        });
    }
};