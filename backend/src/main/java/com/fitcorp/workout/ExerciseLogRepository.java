package com.fitcorp.workout;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExerciseLogRepository extends JpaRepository<ExerciseLog, String> {
    List<ExerciseLog> findByWorkoutLogId(String workoutLogId);
}
