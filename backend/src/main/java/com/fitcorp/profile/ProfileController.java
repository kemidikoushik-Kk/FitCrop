package com.fitcorp.profile;

import com.fitcorp.common.ApiResponse;
import com.fitcorp.profile.dto.OnboardingRequest;
import com.fitcorp.profile.dto.UpdateProfileRequest;
import com.fitcorp.profile.dto.UserProfileResponse;
import com.fitcorp.security.UserPrincipal;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/profile")
@RequiredArgsConstructor
@Tag(name = "Profile", description = "User profile and fitness onboarding endpoints")
public class ProfileController {

    private final ProfileService profileService;

    @GetMapping
    @Operation(summary = "Get the authenticated user's fitness profile")
    public ResponseEntity<ApiResponse<UserProfileResponse>> getProfile(
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        UserProfileResponse response = profileService.getProfile(userPrincipal.getId());
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @PutMapping
    @Operation(summary = "Update authenticated user's fitness profile")
    public ResponseEntity<ApiResponse<UserProfileResponse>> updateProfile(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @Valid @RequestBody UpdateProfileRequest request) {
        UserProfileResponse response = profileService.updateProfile(userPrincipal.getId(), request);
        return ResponseEntity.ok(ApiResponse.ok(response, "Profile updated successfully"));
    }

    @PostMapping("/onboarding")
    @Operation(summary = "Submit multi-step onboarding wizard and finalize initial profile")
    public ResponseEntity<ApiResponse<UserProfileResponse>> completeOnboarding(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @Valid @RequestBody OnboardingRequest request) {
        UserProfileResponse response = profileService.completeOnboarding(userPrincipal.getId(), request);
        return ResponseEntity.ok(ApiResponse.ok(response, "Onboarding completed successfully"));
    }
}
