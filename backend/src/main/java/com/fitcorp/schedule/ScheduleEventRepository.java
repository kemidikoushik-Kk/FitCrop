package com.fitcorp.schedule;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;

@Repository
public interface ScheduleEventRepository extends JpaRepository<ScheduleEvent, String> {
    List<ScheduleEvent> findByUserIdAndStartTimeBetweenOrderByStartTimeAsc(
            String userId, Instant start, Instant end);

    List<ScheduleEvent> findByUserIdOrderByStartTimeAsc(String userId);
}
