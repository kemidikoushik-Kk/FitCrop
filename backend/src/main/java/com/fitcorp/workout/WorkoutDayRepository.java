package com.fitcorp.workout;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface WorkoutDayRepository extends JpaRepository<WorkoutDay, String> {
    List<WorkoutDay> findByWorkoutPlanId(String workoutPlanId);
    Optional<WorkoutDay> findByWorkoutPlanIdAndDate(String workoutPlanId, LocalDate date);
    Optional<WorkoutDay> findByWorkoutPlanUserIdAndDate(String userId, LocalDate date);
}
