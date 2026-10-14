package com.fitcorp.nutrition.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NutritionSummaryResponse {
    private LocalDate date;
    private Double targetCalories;
    private Double consumedCalories;
    private Double targetProtein;
    private Double consumedProtein;
    private Double remainingProtein;
    private Double targetCarbs;
    private Double consumedCarbs;
    private Double targetFat;
    private Double consumedFat;
    private int proteinProgressPercentage;
    private int calorieProgressPercentage;
    private Integer waterMl;
    private Integer targetWaterMl;
}
