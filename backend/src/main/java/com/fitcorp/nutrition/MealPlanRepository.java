package com.fitcorp.nutrition;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MealPlanRepository extends JpaRepository<MealPlan, String> {
    Optional<MealPlan> findByUserIdAndStatus(String userId, String status);
    Optional<MealPlan> findTopByUserIdOrderByVersionDesc(String userId);
    List<MealPlan> findByUserIdOrderByVersionDesc(String userId);
    long countByUserId(String userId);
}
