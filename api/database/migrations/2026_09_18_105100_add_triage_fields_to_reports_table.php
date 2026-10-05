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
        Schema::table('reports', function (Blueprint $table) {
            // =========================
            // AUTOMATED TRIAGE FACTORS
            // =========================

            $table->string('water_level')
                ->nullable()
                ->after('priority');

            $table->string('road_passability')
                ->nullable()
                ->after('water_level');

            $table->unsignedInteger('affected_residents')
                ->nullable()
                ->after('road_passability');

            $table->string('location_risk')
                ->nullable()
                ->after('affected_residents');

            $table->string('assistance_evacuation_need')
                ->nullable()
                ->after('location_risk');

            $table->json('additional_risk_factors')
                ->nullable()
                ->after('assistance_evacuation_need');

            $table->text('triage_remarks')
                ->nullable()
                ->after('additional_risk_factors');

            // =========================
            // AUTOMATED TRIAGE RESULT
            // =========================

            $table->unsignedTinyInteger('triage_score')
                ->nullable()
                ->after('triage_remarks');

            $table->string('triage_recommendation')
                ->nullable()
                ->after('triage_score');

            $table->timestamp('triage_assessed_at')
                ->nullable()
                ->after('triage_recommendation');

            $table->unsignedBigInteger('triage_assessed_by')
                ->nullable()
                ->after('triage_assessed_at');

            // =========================
            // PRIORITY DECISION
            // =========================

            $table->text('priority_override_reason')
                ->nullable()
                ->after('triage_assessed_by');

            $table->timestamp('priority_assigned_at')
                ->nullable()
                ->after('priority_override_reason');

            $table->unsignedBigInteger('priority_assigned_by')
                ->nullable()
                ->after('priority_assigned_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('reports', function (Blueprint $table) {
            $table->dropColumn([
                'water_level',
                'road_passability',
                'affected_residents',
                'location_risk',
                'assistance_evacuation_need',
                'additional_risk_factors',
                'triage_remarks',
                'triage_score',
                'triage_recommendation',
                'triage_assessed_at',
                'triage_assessed_by',
                'priority_override_reason',
                'priority_assigned_at',
                'priority_assigned_by',
            ]);
        });
    }
};