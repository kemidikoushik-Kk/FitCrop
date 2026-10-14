package com.fitcorp.progress.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProgressSummaryResponse {
    private int currentStreak;
    private int longestStreak;
    private long totalWorkoutsCompleted;
    private int workoutsCompletedThisWeek;
    private int targetWorkoutsThisWeek;
    private int consistencyPercentage;
    private Double currentWeight;
    private Double startingWeight;
    private Double weightChange;
    private long totalMealsLogged;
}
