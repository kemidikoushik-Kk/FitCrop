package com.fitcorp.workout.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WorkoutPlanResponse {
    private String id;
    private String name;
    private Integer version;
    private String goal;
    private LocalDate startDate;
    private LocalDate endDate;
    private String status;
    private List<WorkoutDayResponse> days;
}
