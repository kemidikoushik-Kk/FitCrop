package com.fitcorp.nutrition;

import com.fitcorp.common.ApiResponse;
import com.fitcorp.nutrition.dto.LogNutritionRequest;
import com.fitcorp.nutrition.dto.MealPlanResponse;
import com.fitcorp.nutrition.dto.MealResponse;
import com.fitcorp.nutrition.dto.NutritionSummaryResponse;
import com.fitcorp.security.UserPrincipal;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/v1/nutrition")
@RequiredArgsConstructor
@Tag(name = "Nutrition", description = "Meal plan generation, meal logging, and macro tracking")
public class NutritionController {

    private final NutritionService nutritionService;

    @GetMapping("/today")
    @Operation(summary = "Get scheduled meals for today")
    public ResponseEntity<ApiResponse<List<MealResponse>>> getTodayMeals(
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        return ResponseEntity.ok(ApiResponse.ok(nutritionService.getTodayMeals(userPrincipal.getId())));
    }

    @GetMapping("/plans")
    @Operation(summary = "Get the active meal plan")
    public ResponseEntity<ApiResponse<MealPlanResponse>> getActivePlan(
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        return ResponseEntity.ok(ApiResponse.ok(nutritionService.getActivePlan(userPrincipal.getId())));
    }

    @GetMapping("/summary")
    @Operation(summary = "Get macro summary for specified date (default today)")
    public ResponseEntity<ApiResponse<NutritionSummaryResponse>> getSummary(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(ApiResponse.ok(nutritionService.getSummary(userPrincipal.getId(), date)));
    }

    @PostMapping("/generate")
    @Operation(summary = "Generate a new personalized nutrition plan version")
    public ResponseEntity<ApiResponse<MealPlanResponse>> generatePlan(
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        MealPlanResponse plan = nutritionService.generatePlan(userPrincipal.getId());
        return ResponseEntity.ok(ApiResponse.ok(plan, "New nutrition plan generated successfully"));
    }

    @PostMapping("/meals/{id}/consume")
    @Operation(summary = "Mark a meal as eaten and add its nutrients to daily log")
    public ResponseEntity<ApiResponse<MealResponse>> markMealConsumed(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable String id) {
        MealResponse response = nutritionService.markMealConsumed(userPrincipal.getId(), id);
        return ResponseEntity.ok(ApiResponse.ok(response, "Meal marked as eaten"));
    }

    @PostMapping("/meals/{id}/replace")
    @Operation(summary = "Replace meal with another compatible food item")
    public ResponseEntity<ApiResponse<MealResponse>> replaceMeal(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable String id) {
        MealResponse response = nutritionService.replaceMeal(userPrincipal.getId(), id);
        return ResponseEntity.ok(ApiResponse.ok(response, "Meal replaced with an alternative"));
    }

    @PostMapping("/log")
    @Operation(summary = "Manually log daily water and macro intake")
    public ResponseEntity<ApiResponse<NutritionSummaryResponse>> logNutrition(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @Valid @RequestBody LogNutritionRequest request) {
        NutritionSummaryResponse summary = nutritionService.logNutrition(userPrincipal.getId(), request);
        return ResponseEntity.ok(ApiResponse.ok(summary, "Nutrition log updated"));
    }
}
