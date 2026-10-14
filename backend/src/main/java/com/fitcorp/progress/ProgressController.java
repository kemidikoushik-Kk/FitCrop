package com.fitcorp.progress;

import com.fitcorp.common.ApiResponse;
import com.fitcorp.progress.dto.BodyMeasurementDto;
import com.fitcorp.progress.dto.ProgressChartsResponse;
import com.fitcorp.progress.dto.ProgressEntryDto;
import com.fitcorp.progress.dto.ProgressSummaryResponse;
import com.fitcorp.security.UserPrincipal;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/progress")
@RequiredArgsConstructor
@Tag(name = "Progress", description = "Progress tracking, body measurements, streak, and charts analytics")
public class ProgressController {

    private final ProgressService progressService;

    @GetMapping("/summary")
    @Operation(summary = "Get workout and habit consistency summary including real streaks")
    public ResponseEntity<ApiResponse<ProgressSummaryResponse>> getSummary(
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        return ResponseEntity.ok(ApiResponse.ok(progressService.getSummary(userPrincipal.getId())));
    }

    @GetMapping("/charts")
    @Operation(summary = "Get aggregated datasets for charts")
    public ResponseEntity<ApiResponse<ProgressChartsResponse>> getCharts(
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        return ResponseEntity.ok(ApiResponse.ok(progressService.getCharts(userPrincipal.getId())));
    }

    @PostMapping
    @Operation(summary = "Record daily progress entry (weight, water, habits)")
    public ResponseEntity<ApiResponse<ProgressEntryDto>> recordProgress(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestBody ProgressEntryDto request) {
        ProgressEntryDto result = progressService.recordProgress(userPrincipal.getId(), request);
        return ResponseEntity.ok(ApiResponse.ok(result, "Progress logged successfully"));
    }

    @PostMapping("/measurements")
    @Operation(summary = "Record optional body measurements (waist, hips, body fat %)")
    public ResponseEntity<ApiResponse<BodyMeasurementDto>> recordMeasurement(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestBody BodyMeasurementDto request) {
        BodyMeasurementDto result = progressService.recordMeasurement(userPrincipal.getId(), request);
        return ResponseEntity.ok(ApiResponse.ok(result, "Measurements saved successfully"));
    }
}
