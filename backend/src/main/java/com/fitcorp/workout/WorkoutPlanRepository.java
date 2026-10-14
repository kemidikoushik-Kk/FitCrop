package com.fitcorp.workout;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WorkoutPlanRepository extends JpaRepository<WorkoutPlan, String> {
    Optional<WorkoutPlan> findByUserIdAndStatus(String userId, String status);
    Optional<WorkoutPlan> findTopByUserIdOrderByVersionDesc(String userId);
    List<WorkoutPlan> findByUserIdOrderByVersionDesc(String userId);
    long countByUserId(String userId);
}
