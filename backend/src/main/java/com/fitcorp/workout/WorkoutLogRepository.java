package com.fitcorp.workout;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Repository
public interface WorkoutLogRepository extends JpaRepository<WorkoutLog, String> {
    List<WorkoutLog> findByUserIdOrderByStartedAtDesc(String userId);
    List<WorkoutLog> findByUserIdAndStartedAtBetweenOrderByStartedAtAsc(String userId, Instant start, Instant end);
    Optional<WorkoutLog> findByUserIdAndWorkoutDayId(String userId, String workoutDayId);
    long countByUserIdAndStatus(String userId, String status);

    @Query("SELECT COUNT(wl) FROM WorkoutLog wl WHERE wl.status = 'COMPLETED'")
    long countAllCompleted();
}
