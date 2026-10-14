package com.fitcorp.food;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FoodItemRepository extends JpaRepository<FoodItem, String> {

    Optional<FoodItem> findByIdAndIsActiveTrue(String id);

    List<FoodItem> findByIsActiveTrue();

    @Query("SELECT f FROM FoodItem f WHERE f.isActive = true " +
            "AND (:query IS NULL OR LOWER(f.name) LIKE LOWER(CONCAT('%', :query, '%'))) " +
            "AND (:category IS NULL OR f.category = :category) " +
            "AND (:isVegetarian IS NULL OR f.isVegetarian = :isVegetarian) " +
            "AND (:isVegan IS NULL OR f.isVegan = :isVegan)")
    Page<FoodItem> searchFoods(
            @Param("query") String query,
            @Param("category") String category,
            @Param("isVegetarian") Boolean isVegetarian,
            @Param("isVegan") Boolean isVegan,
            Pageable pageable);

    @Query("SELECT f FROM FoodItem f WHERE f.isActive = true " +
            "AND (:dietaryPref = 'NO_PREFERENCE' OR " +
            "     (:dietaryPref = 'VEGETARIAN' AND f.isVegetarian = true) OR " +
            "     (:dietaryPref = 'VEGAN' AND f.isVegan = true) OR " +
            "     (:dietaryPref = 'EGGETARIAN' AND (f.isVegetarian = true OR f.name LIKE '%Egg%')) OR " +
            "     (:dietaryPref = 'HIGH_PROTEIN' AND f.protein >= 10.0))")
    List<FoodItem> findDietaryCompatibleFoods(@Param("dietaryPref") String dietaryPref);
}
