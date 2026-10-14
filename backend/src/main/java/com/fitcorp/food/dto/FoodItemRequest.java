package com.fitcorp.food.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FoodItemRequest {

    @NotBlank(message = "Food name is required")
    private String name;

    @NotBlank(message = "Category is required")
    private String category;

    @NotBlank(message = "Serving unit is required")
    private String servingUnit;

    @NotNull(message = "Serving size in grams is required")
    @Positive(message = "Serving size must be positive")
    private Double servingSizeGrams;

    @NotNull(message = "Calories is required")
    private Double calories;

    @NotNull(message = "Protein is required")
    private Double protein;

    @NotNull(message = "Carbohydrates is required")
    private Double carbohydrates;

    @NotNull(message = "Fat is required")
    private Double fat;

    private Double fiber;
    private Boolean isVegetarian;
    private Boolean isVegan;
    private String allergenTags;
    private Boolean isActive;
}
