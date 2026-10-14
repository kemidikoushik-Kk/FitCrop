package com.fitcorp.admin;

import com.fitcorp.admin.dto.AdminStatsResponse;
import com.fitcorp.admin.dto.AdminUserDto;
import com.fitcorp.admin.dto.UpdateUserRoleRequest;
import com.fitcorp.admin.dto.UpdateUserStatusRequest;
import com.fitcorp.common.ApiResponse;
import com.fitcorp.common.PageResponse;
import com.fitcorp.exercise.ExerciseService;
import com.fitcorp.exercise.dto.ExerciseRequest;
import com.fitcorp.exercise.dto.ExerciseResponse;
import com.fitcorp.food.FoodService;
import com.fitcorp.food.dto.FoodItemRequest;
import com.fitcorp.food.dto.FoodItemResponse;
import com.fitcorp.security.UserPrincipal;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
@Tag(name = "Admin", description = "Administrative portal for user, exercise, and nutrition catalog management")
public class AdminController {

    private final AdminService adminService;
    private final ExerciseService exerciseService;
    private final FoodService foodService;

    @GetMapping("/dashboard")
    @Operation(summary = "Get platform-wide statistics for admin overview")
    public ResponseEntity<ApiResponse<AdminStatsResponse>> getDashboardStats() {
        return ResponseEntity.ok(ApiResponse.ok(adminService.getStats()));
    }

    @GetMapping("/users")
    @Operation(summary = "Search and list users with pagination")
    public ResponseEntity<ApiResponse<PageResponse<AdminUserDto>>> getUsers(
            @RequestParam(required = false) String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy) {

        int clampedSize = Math.min(Math.max(size, 1), 50);
        Pageable pageable = PageRequest.of(page, clampedSize, Sort.by(sortBy).descending());
        return ResponseEntity.ok(ApiResponse.ok(adminService.getUsers(query, pageable)));
    }

    @PatchMapping("/users/{id}/status")
    @Operation(summary = "Activate or deactivate a user account")
    public ResponseEntity<ApiResponse<AdminUserDto>> updateUserStatus(
            @AuthenticationPrincipal UserPrincipal admin,
            @PathVariable String id,
            @Valid @RequestBody UpdateUserStatusRequest request) {
        AdminUserDto updated = adminService.updateUserStatus(admin.getId(), id, request);
        return ResponseEntity.ok(ApiResponse.ok(updated, "User status updated successfully"));
    }

    @PatchMapping("/users/{id}/role")
    @Operation(summary = "Update user role assignments")
    public ResponseEntity<ApiResponse<AdminUserDto>> updateUserRole(
            @AuthenticationPrincipal UserPrincipal admin,
            @PathVariable String id,
            @Valid @RequestBody UpdateUserRoleRequest request) {
        AdminUserDto updated = adminService.updateUserRoles(admin.getId(), id, request);
        return ResponseEntity.ok(ApiResponse.ok(updated, "User roles updated successfully"));
    }

    // Exercise Administration
    @GetMapping("/exercises")
    @Operation(summary = "List catalog exercises for admin management")
    public ResponseEntity<ApiResponse<PageResponse<ExerciseResponse>>> getAdminExercises(
            @RequestParam(required = false) String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("name").ascending());
        return ResponseEntity.ok(ApiResponse.ok(exerciseService.searchExercises(query, null, null, null, null, pageable)));
    }

    @PostMapping("/exercises")
    @Operation(summary = "Create a new catalog exercise")
    public ResponseEntity<ApiResponse<ExerciseResponse>> createExercise(
            @AuthenticationPrincipal UserPrincipal admin,
            @Valid @RequestBody ExerciseRequest request) {
        ExerciseResponse response = exerciseService.createExercise(request);
        adminService.logAudit(admin.getId(), "CREATE_EXERCISE", "Exercise", response.getId(), request.getName());
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok(response, "Exercise created"));
    }

    @PutMapping("/exercises/{id}")
    @Operation(summary = "Update an existing catalog exercise")
    public ResponseEntity<ApiResponse<ExerciseResponse>> updateExercise(
            @AuthenticationPrincipal UserPrincipal admin,
            @PathVariable String id,
            @Valid @RequestBody ExerciseRequest request) {
        ExerciseResponse response = exerciseService.updateExercise(id, request);
        adminService.logAudit(admin.getId(), "UPDATE_EXERCISE", "Exercise", id, request.getName());
        return ResponseEntity.ok(ApiResponse.ok(response, "Exercise updated"));
    }

    @DeleteMapping("/exercises/{id}")
    @Operation(summary = "Soft-deactivate an exercise from active catalog")
    public ResponseEntity<ApiResponse<Void>> deactivateExercise(
            @AuthenticationPrincipal UserPrincipal admin,
            @PathVariable String id) {
        exerciseService.deactivateExercise(id);
        adminService.logAudit(admin.getId(), "DEACTIVATE_EXERCISE", "Exercise", id, "Deactivated");
        return ResponseEntity.ok(ApiResponse.message("Exercise deactivated"));
    }

    // Food Administration
    @GetMapping("/foods")
    @Operation(summary = "List catalog foods for admin management")
    public ResponseEntity<ApiResponse<PageResponse<FoodItemResponse>>> getAdminFoods(
            @RequestParam(required = false) String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("name").ascending());
        return ResponseEntity.ok(ApiResponse.ok(foodService.searchFoods(query, null, null, null, pageable)));
    }

    @PostMapping("/foods")
    @Operation(summary = "Create a new food item in catalog")
    public ResponseEntity<ApiResponse<FoodItemResponse>> createFood(
            @AuthenticationPrincipal UserPrincipal admin,
            @Valid @RequestBody FoodItemRequest request) {
        FoodItemResponse response = foodService.createFood(request);
        adminService.logAudit(admin.getId(), "CREATE_FOOD", "FoodItem", response.getId(), request.getName());
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok(response, "Food item created"));
    }

    @PutMapping("/foods/{id}")
    @Operation(summary = "Update an existing food item in catalog")
    public ResponseEntity<ApiResponse<FoodItemResponse>> updateFood(
            @AuthenticationPrincipal UserPrincipal admin,
            @PathVariable String id,
            @Valid @RequestBody FoodItemRequest request) {
        FoodItemResponse response = foodService.updateFood(id, request);
        adminService.logAudit(admin.getId(), "UPDATE_FOOD", "FoodItem", id, request.getName());
        return ResponseEntity.ok(ApiResponse.ok(response, "Food item updated"));
    }

    @DeleteMapping("/foods/{id}")
    @Operation(summary = "Soft-deactivate a food item from active catalog")
    public ResponseEntity<ApiResponse<Void>> deactivateFood(
            @AuthenticationPrincipal UserPrincipal admin,
            @PathVariable String id) {
        foodService.deactivateFood(id);
        adminService.logAudit(admin.getId(), "DEACTIVATE_FOOD", "FoodItem", id, "Deactivated");
        return ResponseEntity.ok(ApiResponse.message("Food item deactivated"));
    }
}
