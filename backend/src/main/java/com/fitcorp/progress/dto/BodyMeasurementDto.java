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
public class BodyMeasurementDto {
    private String id;
    private LocalDate date;
    private Double weightKg;
    private Double bodyFatPercentage;
    private Double chestCm;
    private Double waistCm;
    private Double hipsCm;
    private Double armsCm;
    private Double thighsCm;
    private String notes;
}
