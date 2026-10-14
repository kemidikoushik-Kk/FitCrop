package com.fitcorp.workout;

import com.fitcorp.common.ApiResponse;
import com.fitcorp.security.UserPrincipal;
import com.fitcorp.workout.dto.CompleteWorkoutRequest;
import com.fitcorp.workout.dto.WorkoutDayResponse;
import com.fitcorp.workout.dto.WorkoutLogResponse;
import com.fitcorp.workout.dto.WorkoutPlanResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/workouts")
@RequiredArgsConstructor
@Tag(name = "Workouts", description = "Workout plan generation, today's workout, and workout tracking")
public class WorkoutController {

    private final WorkoutService workoutService;

    @GetMapping("/today")
    @Operation(summary = "Get workout scheduled for today")
    public ResponseEntity<ApiResponse<WorkoutDayResponse>> getTodayWorkout(
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        return ResponseEntity.ok(ApiResponse.ok(workoutService.getTodayWorkout(userPrincipal.getId())));
    }

    @GetMapping
    @Operation(summary = "Get the active workout plan with all weekly routines")
    public ResponseEntity<ApiResponse<WorkoutPlanResponse>> getActivePlan(
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        return ResponseEntity.ok(ApiResponse.ok(workoutService.getActivePlan(userPrincipal.getId())));
    }

    @PostMapping("/generate")
    @Operation(summary = "Generate a new personalized workout plan version")
    public ResponseEntity<ApiResponse<WorkoutPlanResponse>> generatePlan(
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        WorkoutPlanResponse plan = workoutService.generatePlan(userPrincipal.getId());
        return ResponseEntity.ok(ApiResponse.ok(plan, "New workout plan generated successfully"));
    }

    @PostMapping("/{id}/start")
    @Operation(summary = "Mark workout day as in-progress")
    public ResponseEntity<ApiResponse<WorkoutDayResponse>> startWorkout(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable String id) {
        WorkoutDayResponse response = workoutService.startWorkout(userPrincipal.getId(), id);
        return ResponseEntity.ok(ApiResponse.ok(response, "Workout started"));
    }

    @PostMapping("/{id}/complete")
    @Operation(summary = "Complete workout and log exercise metrics")
    public ResponseEntity<ApiResponse<WorkoutLogResponse>> completeWorkout(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable String id,
            @RequestBody(required = false) CompleteWorkoutRequest request) {
        if (request == null) {
            request = new CompleteWorkoutRequest();
        }
        request.setWorkoutDayId(id);
        WorkoutLogResponse response = workoutService.completeWorkout(userPrincipal.getId(), request);
        return ResponseEntity.ok(ApiResponse.ok(response, "Workout completed! Great consistency."));
    }

    @PostMapping("/{id}/skip")
    @Operation(summary = "Skip scheduled workout day")
    public ResponseEntity<ApiResponse<WorkoutDayResponse>> skipWorkout(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable String id) {
        WorkoutDayResponse response = workoutService.skipWorkout(userPrincipal.getId(), id);
        return ResponseEntity.ok(ApiResponse.ok(response, "Workout skipped"));
    }
}
