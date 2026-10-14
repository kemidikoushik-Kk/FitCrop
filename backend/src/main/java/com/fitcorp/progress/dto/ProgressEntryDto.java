package com.fitcorp.progress.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProgressEntryDto {
    private String id;
    private LocalDate date;
    private Double weightKg;
    private Integer workoutsCompleted;
    private Integer mealsLogged;
    private Integer waterMl;
    private String notes;
}
