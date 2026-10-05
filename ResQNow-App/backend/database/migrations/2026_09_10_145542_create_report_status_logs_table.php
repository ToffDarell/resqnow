<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Create the history of status changes for reports.
     */
    public function up(): void
    {
        Schema::create('report_status_logs', function (Blueprint $table) {
            $table->id();

            // Report this status update belongs to
            $table->foreignId('report_id')
                ->constrained('reports')
                ->cascadeOnDelete();

            // Example:
            // Submitted
            // Pending Verification
            // Verified
            // Assigned
            // In Progress
            // Responders En Route
            // Responded
            // Resolved
            // Invalid
            $table->string('status', 80)
                ->index();

            // Optional explanation from barangay personnel
            $table->text('remarks')
                ->nullable();

            // User who caused the status change.
            // Null is allowed for system-generated updates.
            $table->foreignId('changed_by_user_id')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            $table->timestamps();

            // Useful when loading a report timeline
            $table->index([
                'report_id',
                'created_at',
            ]);
        });
    }

    /**
     * Remove the report status history table.
     */
    public function down(): void
    {
        Schema::dropIfExists('report_status_logs');
    }
};
