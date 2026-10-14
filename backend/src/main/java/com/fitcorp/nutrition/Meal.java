package com.fitcorp.nutrition;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "meals")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Meal {

    @Id
    @Column(length = 36)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "meal_plan_id", nullable = false)
    private MealPlan mealPlan;

    private LocalDate date;

    @Column(name = "meal_type", nullable = false, length = 50)
    private String mealType; // BREAKFAST, MID_MORNING, LUNCH, EVENING_SNACK, DINNER

    @Column(name = "meal_time")
    private LocalTime mealTime;

    @Column(nullable = false, length = 100)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Builder.Default
    @Column(name = "is_consumed")
    private Boolean isConsumed = false;

    @Column(name = "consumed_at")
    private Instant consumedAt;

    @Builder.Default
    @OneToMany(mappedBy = "meal", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<MealItem> mealItems = new ArrayList<>();
}
