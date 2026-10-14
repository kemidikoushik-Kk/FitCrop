package com.fitcorp.nutrition;

import com.fitcorp.user.User;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;
import java.time.LocalDate;

@Entity
@Table(name = "nutrition_logs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NutritionLog {

    @Id
    @Column(length = 36)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private LocalDate date;

    @Builder.Default
    private Double calories = 0.0;

    @Builder.Default
    private Double protein = 0.0;

    @Builder.Default
    private Double carbohydrates = 0.0;

    @Builder.Default
    private Double fat = 0.0;

    @Builder.Default
    private Double fiber = 0.0;

    @Builder.Default
    @Column(name = "water_ml")
    private Integer waterMl = 0;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private Instant createdAt;
}
