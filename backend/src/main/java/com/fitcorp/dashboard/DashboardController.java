package com.fitcorp.dashboard;

import com.fitcorp.common.ApiResponse;
import com.fitcorp.dashboard.dto.DashboardResponse;
import com.fitcorp.security.UserPrincipal;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/dashboard")
@RequiredArgsConstructor
@Tag(name = "Dashboard", description = "Main daily corporate wellness dashboard view")
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping
    @Operation(summary = "Get aggregated daily dashboard state (workout, nutrition, streak, schedule)")
    public ResponseEntity<ApiResponse<DashboardResponse>> getDashboard(
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        DashboardResponse data = dashboardService.getDashboardData(userPrincipal.getId());
        return ResponseEntity.ok(ApiResponse.ok(data));
    }
}
