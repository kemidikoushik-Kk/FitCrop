package com.fitcorp.goal;

import com.fitcorp.common.ApiResponse;
import com.fitcorp.goal.dto.GoalDto;
import com.fitcorp.goal.dto.UpdateUserGoalsRequest;
import com.fitcorp.security.UserPrincipal;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
@Tag(name = "Goals", description = "Fitness goals catalog and user goal preferences")
public class GoalController {

    private final GoalService goalService;

    @GetMapping("/goals")
    @Operation(summary = "Get all supported active fitness goals")
    public ResponseEntity<ApiResponse<List<GoalDto>>> getAllGoals() {
        return ResponseEntity.ok(ApiResponse.ok(goalService.getAllActiveGoals()));
    }

    @GetMapping("/profile/goals")
    @Operation(summary = "Get current authenticated user's selected goals")
    public ResponseEntity<ApiResponse<List<GoalDto>>> getUserGoals(
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        return ResponseEntity.ok(ApiResponse.ok(goalService.getUserGoals(userPrincipal.getId())));
    }

    @PutMapping("/profile/goals")
    @Operation(summary = "Update authenticated user's selected primary and secondary goals")
    public ResponseEntity<ApiResponse<List<GoalDto>>> updateUserGoals(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @Valid @RequestBody UpdateUserGoalsRequest request) {
        List<GoalDto> updated = goalService.updateUserGoals(userPrincipal.getId(), request);
        return ResponseEntity.ok(ApiResponse.ok(updated, "Goals updated successfully"));
    }
}
