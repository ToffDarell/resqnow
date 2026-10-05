<?php

namespace App\Services;

class TriageService
{
    /**
     * Calculate a deterministic triage score from the approved
     * operational parameters used by ResQNow.
     *
     * Maximum score: 20
     */
    public function assess(array $data): array
    {
        $waterLevelScore = $this->waterLevelScore($data['water_level'] ?? null);
        $roadScore = $this->roadPassabilityScore($data['road_passability'] ?? null);
        $affectedScore = $this->affectedResidentsScore($data['affected_residents'] ?? null);
        $locationRiskScore = $this->locationRiskScore($data['location_risk'] ?? null);
        $assistanceScore = $this->assistanceEvacuationScore(
            $data['assistance_evacuation_need'] ?? null
        );

        $score =
            $waterLevelScore +
            $roadScore +
            $affectedScore +
            $locationRiskScore +
            $assistanceScore;

        return [
            'score' => $score,
            'recommendation' => $this->recommendation($score),
            'factor_scores' => [
                'water_level' => $waterLevelScore,
                'road_passability' => $roadScore,
                'affected_residents' => $affectedScore,
                'location_risk' => $locationRiskScore,
                'assistance_evacuation_need' => $assistanceScore,
            ],
        ];
    }

    private function waterLevelScore(?string $value): int
    {
        return match ($value) {
            null, '', 'None', 'Not applicable' => 0,
            'Below knee level' => 1,
            'Knee level' => 2,
            'Above knee level' => 3,
            'Waist level or higher' => 4,
            default => 0,
        };
    }

    private function roadPassabilityScore(?string $value): int
    {
        return match ($value) {
            null, '', 'Fully passable' => 0,
            'Passable with caution' => 1,
            'Partially passable' => 2,
            'Difficult to pass' => 3,
            'Impassable' => 4,
            default => 0,
        };
    }

    private function affectedResidentsScore(?int $value): int
    {
        if ($value === null) {
            return 0;
        }

        return match (true) {
            $value <= 2 => 0,
            $value <= 10 => 1,
            $value <= 25 => 2,
            $value <= 50 => 3,
            default => 4,
        };
    }

    private function locationRiskScore(?string $value): int
    {
        return match ($value) {
            null, '', 'Low' => 0,
            'Moderate' => 1,
            'High' => 3,
            'Critical' => 4,
            default => 0,
        };
    }

    private function assistanceEvacuationScore(?string $value): int
    {
        return match ($value) {
            null, '', 'No immediate assistance needed' => 0,
            'Assistance needed' => 1,
            'Urgent assistance needed' => 2,
            'Evacuation recommended' => 3,
            'Immediate evacuation required' => 4,
            default => 0,
        };
    }

        private function recommendation(int $score): string
    {
        return match (true) {
            $score >= 13 => 'Critical',
            $score >= 9 => 'High',
            $score >= 5 => 'Moderate',
            default => 'Low',
        };
    }
}