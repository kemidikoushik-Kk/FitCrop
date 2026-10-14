package com.fitcorp.exercise;

import com.fitcorp.common.ApiResponse;
import com.fitcorp.common.PageResponse;
import com.fitcorp.exercise.dto.ExerciseResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/exercises")
@RequiredArgsConstructor
@Tag(name = "Exercises", description = "Exercise catalog search and details")
public class ExerciseController {

    private final ExerciseService exerciseService;

    @GetMapping
    @Operation(summary = "Search and filter active exercises in the catalog")
    public ResponseEntity<ApiResponse<PageResponse<ExerciseResponse>>> getExercises(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String muscleGroup,
            @RequestParam(required = false) String equipment,
            @RequestParam(required = false) String difficulty,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "name") String sortBy) {

        int clampedSize = Math.min(Math.max(size, 1), 50);
        Pageable pageable = PageRequest.of(page, clampedSize, Sort.by(sortBy).ascending());
        PageResponse<ExerciseResponse> result = exerciseService.searchExercises(
                query, category, muscleGroup, equipment, difficulty, pageable);

        return ResponseEntity.ok(ApiResponse.ok(result));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get full exercise details by ID")
    public ResponseEntity<ApiResponse<ExerciseResponse>> getExerciseById(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.ok(exerciseService.getExerciseById(id)));
    }
}
