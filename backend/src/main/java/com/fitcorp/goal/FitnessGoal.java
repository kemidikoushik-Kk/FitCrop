package com.fitcorp.goal;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.*;

@Entity
@Table(name = "fitness_goals")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FitnessGoal {

    @Id
    @Column(length = 36)
    private String id;

    @Column(nullable = false, unique = true, length = 50)
    private String code;

    @Column(nullable = false, length = 100)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "icon_name", length = 50)
    private String iconName;

    @Column(name = "recommended_focus", columnDefinition = "TEXT")
    private String recommendedFocus;

    @Column(name = "expected_metrics", length = 255)
    private String expectedMetrics;

    @Builder.Default
    @Column(name = "is_active")
    private Boolean isActive = true;
}
