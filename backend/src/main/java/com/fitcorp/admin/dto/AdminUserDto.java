package com.fitcorp.admin.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminUserDto {
    private String id;
    private String email;
    private String fullName;
    private Boolean isActive;
    private Boolean isEmailVerified;
    private Boolean onboardingCompleted;
    private Set<String> roles;
    private Instant createdAt;
}
