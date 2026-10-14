package com.fitcorp.food;

import com.fitcorp.common.ApiResponse;
import com.fitcorp.common.PageResponse;
import com.fitcorp.food.dto.FoodItemResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/foods")
@RequiredArgsConstructor
@Tag(name = "Foods", description = "Food item catalog search and nutritional facts")
public class FoodController {

    private final FoodService foodService;

    @GetMapping
    @Operation(summary = "Search and filter food items in catalog")
    public ResponseEntity<ApiResponse<PageResponse<FoodItemResponse>>> getFoods(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) Boolean isVegetarian,
            @RequestParam(required = false) Boolean isVegan,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "name") String sortBy) {

        int clampedSize = Math.min(Math.max(size, 1), 50);
        Pageable pageable = PageRequest.of(page, clampedSize, Sort.by(sortBy).ascending());
        PageResponse<FoodItemResponse> result = foodService.searchFoods(
                query, category, isVegetarian, isVegan, pageable);

        return ResponseEntity.ok(ApiResponse.ok(result));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get food item details and estimated nutritional facts by ID")
    public ResponseEntity<ApiResponse<FoodItemResponse>> getFoodById(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.ok(foodService.getFoodById(id)));
    }
}
