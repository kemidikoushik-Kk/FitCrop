package com.fitcorp.admin.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminStatsResponse {
    private long totalUsers;
    private long activeUsers;
    private long totalWorkoutsCompleted;
    private long totalPlansGenerated;
    private long totalMealPlansGenerated;
    private long totalExercises;
    private long totalFoods;
}
