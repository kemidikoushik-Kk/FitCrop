package com.fitcorp.nutrition.dto;

import com.fitcorp.food.dto.FoodItemResponse;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MealItemDto {
    private String id;
    private FoodItemResponse foodItem;
    private Double quantity;
    private Double servings;
}
