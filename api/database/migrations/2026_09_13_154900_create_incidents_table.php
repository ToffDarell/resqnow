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
        Schema::create('incidents', function (Blueprint $table) {
            $table->id();

            // Original report that created this incident
            $table->foreignId('report_id')
                ->constrained()
                ->cascadeOnDelete();

            // Basic incident information
            $table->string('incident_code')->unique();
            $table->string('title');

            $table->string('type');
            $table->string('category')->nullable();

            $table->text('description')->nullable();

            // Location
            $table->string('location');
            $table->decimal('latitude', 10, 7)->nullable();
            $table->decimal('longitude', 10, 7)->nullable();

            // Triage priority inherited from the report
            $table->enum('priority', [
                'Critical',
                'High',
                'Moderate',
                'Low'
            ]);

            // Response lifecycle
            $table->enum('status', [
                'Pending Response',
                'Dispatched',
                'In Progress',
                'Resolved',
                'Closed'
            ])->default('Pending Response');

            // Response details
            $table->timestamp('dispatched_at')->nullable();
            $table->timestamp('resolved_at')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('incidents');
    }
};