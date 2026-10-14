package com.fitcorp.progress.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProgressChartsResponse {

    private List<WeightPoint> weightTrend;
    private List<ConsistencyBar> workoutConsistency;
    private List<NutritionPoint> nutritionConsistency;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class WeightPoint {
        private LocalDate date;
        private Double weight;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ConsistencyBar {
        private String dayOfWeek;
        private LocalDate date;
        private int completed;
        private int target;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class NutritionPoint {
        private LocalDate date;
        private Double consumedProtein;
        private Double targetProtein;
        private Double consumedCalories;
        private Double targetCalories;
    }
}
