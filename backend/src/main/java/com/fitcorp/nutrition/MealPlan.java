package com.fitcorp.nutrition;

import com.fitcorp.user.User;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "meal_plans")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MealPlan {

    @Id
    @Column(length = 36)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Builder.Default
    private Integer version = 1;

    @Column(name = "target_calories")
    private Double targetCalories;

    @Column(name = "target_protein")
    private Double targetProtein;

    @Column(name = "target_carbs")
    private Double targetCarbs;

    @Column(name = "target_fat")
    private Double targetFat;

    @Builder.Default
    @Column(length = 30)
    private String status = "ACTIVE"; // ACTIVE, ARCHIVED

    @Builder.Default
    @OneToMany(mappedBy = "mealPlan", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("mealTime ASC")
    private List<Meal> meals = new ArrayList<>();

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private Instant updatedAt;
}
