package com.fitcorp.schedule;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WorkScheduleRepository extends JpaRepository<WorkSchedule, String> {
    List<WorkSchedule> findByUserId(String userId);
    Optional<WorkSchedule> findByUserIdAndDayOfWeek(String userId, String dayOfWeek);
    void deleteByUserId(String userId);
}
