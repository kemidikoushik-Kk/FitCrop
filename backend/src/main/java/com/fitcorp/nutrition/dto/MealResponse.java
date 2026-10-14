package com.fitcorp.nutrition.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MealResponse {
    private String id;
    private LocalDate date;
    private String mealType;
    private LocalTime mealTime;
    private String title;
    private String notes;
    private Boolean isConsumed;
    private Double calories;
    private Double protein;
    private Double carbohydrates;
    private Double fat;
    private List<MealItemDto> items;
}
