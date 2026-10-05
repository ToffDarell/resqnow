<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Create report personnel assignments.
     */
    public function up(): void
    {
        Schema::create('report_assignments', function (Blueprint $table) {
            $table->id();

            // Report receiving the assignment
            $table->foreignId('report_id')
                ->constrained('reports')
                ->cascadeOnDelete();

            // Personnel/responder assigned to the report
            $table->foreignId('assigned_user_id')
                ->constrained('users')
                ->cascadeOnDelete();

            // Admin/barangay user who made the assignment
            $table->foreignId('assigned_by_user_id')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            // Optional assignment note
            $table->text('notes')
                ->nullable();

            // When the assignment became active
            $table->timestamp('assigned_at')
                ->useCurrent();

            // Filled when personnel is removed or reassigned
            $table->timestamp('unassigned_at')
                ->nullable();

            $table->timestamps();

            // Short custom index names for MySQL
            $table->index(
                ['report_id', 'assigned_at'],
                'report_assignment_time_idx'
            );

            $table->index(
                ['report_id', 'assigned_user_id', 'unassigned_at'],
                'report_assignment_user_idx'
            );
        });
    }

    /**
     * Remove report assignments.
     */
    public function down(): void
    {
        Schema::dropIfExists('report_assignments');
    }
};
