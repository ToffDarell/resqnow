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
        Schema::table('users', function (Blueprint $table) {
            $table->string('verification_status')
                ->default('Pending')
                ->after('status');

            $table->text('verification_remarks')
                ->nullable()
                ->after('verification_status');

            $table->timestamp('verified_at')
                ->nullable()
                ->after('verification_remarks');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'verification_status',
                'verification_remarks',
                'verified_at',
            ]);
        });
    }
};