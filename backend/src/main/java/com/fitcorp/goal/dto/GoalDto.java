package com.fitcorp.goal.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GoalDto {
    private String id;
    private String code;
    private String title;
    private String description;
    private String iconName;
    private String recommendedFocus;
    private String expectedMetrics;
    private Boolean isPrimary;
    private LocalDate targetDate;
    private String notes;
}
