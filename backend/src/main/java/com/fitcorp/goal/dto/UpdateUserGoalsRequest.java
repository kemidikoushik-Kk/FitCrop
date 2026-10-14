package com.fitcorp.goal.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateUserGoalsRequest {

    @NotBlank(message = "Primary goal code is required")
    private String primaryGoalCode;

    private String secondaryGoalCode;
    private LocalDate targetDate;
    private String notes;
}
