package com.fitcorp.food;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;

@Entity
@Table(name = "food_items")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FoodItem {

    @Id
    @Column(length = 36)
    private String id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false, length = 50)
    private String category; // Breakfast, Lunch, Dinner, Snack, Grains, Protein, Dairy, Fruits, Vegetables, Nuts, Beverages

    @Column(name = "serving_unit", nullable = false, length = 50)
    private String servingUnit;

    @Builder.Default
    @Column(name = "serving_size_grams")
    private Double servingSizeGrams = 100.0;

    @Column(nullable = false)
    private Double calories;

    @Column(nullable = false)
    private Double protein;

    @Column(nullable = false)
    private Double carbohydrates;

    @Column(nullable = false)
    private Double fat;

    @Builder.Default
    private Double fiber = 0.0;

    @Builder.Default
    @Column(name = "is_vegetarian")
    private Boolean isVegetarian = true;

    @Builder.Default
    @Column(name = "is_vegan")
    private Boolean isVegan = false;

    @Column(name = "allergen_tags", length = 255)
    private String allergenTags; // Milk, Eggs, Peanuts, Tree nuts, Gluten, Soy, Seafood, None

    @Builder.Default
    @Column(name = "is_active")
    private Boolean isActive = true;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private Instant updatedAt;
}
