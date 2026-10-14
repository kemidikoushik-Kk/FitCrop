package com.fitcorp.food.dto;

import com.fitcorp.food.FoodItem;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FoodItemResponse {

    private String id;
    private String name;
    private String category;
    private String servingUnit;
    private Double servingSizeGrams;
    private Double calories;
    private Double protein;
    private Double carbohydrates;
    private Double fat;
    private Double fiber;
    private Boolean isVegetarian;
    private Boolean isVegan;
    private String allergenTags;
    private Boolean isActive;

    public static FoodItemResponse from(FoodItem item) {
        return FoodItemResponse.builder()
                .id(item.getId())
                .name(item.getName())
                .category(item.getCategory())
                .servingUnit(item.getServingUnit())
                .servingSizeGrams(item.getServingSizeGrams())
                .calories(item.getCalories())
                .protein(item.getProtein())
                .carbohydrates(item.getCarbohydrates())
                .fat(item.getFat())
                .fiber(item.getFiber())
                .isVegetarian(item.getIsVegetarian())
                .isVegan(item.getIsVegan())
                .allergenTags(item.getAllergenTags())
                .isActive(item.getIsActive())
                .build();
    }
}
