package com.fitcorp.nutrition;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface MealRepository extends JpaRepository<Meal, String> {
    List<Meal> findByMealPlanId(String mealPlanId);
    List<Meal> findByMealPlanIdAndDate(String mealPlanId, LocalDate date);
    Optional<Meal> findByIdAndMealPlanUserId(String id, String userId);
}
