package com.fitcorp.workout;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WorkoutExerciseRepository extends JpaRepository<WorkoutExercise, String> {
    List<WorkoutExercise> findByWorkoutDayIdOrderBySequenceOrderAsc(String workoutDayId);
}
