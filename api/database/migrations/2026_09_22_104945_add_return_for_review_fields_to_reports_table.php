<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('reports', function (Blueprint $table) {
            $table->text('verification_remarks')
                ->nullable()
                ->after('verification_status');

            $table->timestamp('returned_at')
                ->nullable()
                ->after('verification_remarks');

            $table->unsignedBigInteger('returned_by')
                ->nullable()
                ->after('returned_at');
        });
    }

    public function down(): void
    {
        Schema::table('reports', function (Blueprint $table) {
            $table->dropColumn([
                'verification_remarks',
                'returned_at',
                'returned_by',
            ]);
        });
    }
};