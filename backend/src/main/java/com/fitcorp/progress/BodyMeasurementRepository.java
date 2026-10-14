package com.fitcorp.progress;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface BodyMeasurementRepository extends JpaRepository<BodyMeasurement, String> {
    Optional<BodyMeasurement> findByUserIdAndDate(String userId, LocalDate date);
    List<BodyMeasurement> findByUserIdOrderByDateDesc(String userId);
    List<BodyMeasurement> findByUserIdAndDateBetweenOrderByDateAsc(String userId, LocalDate start, LocalDate end);
}
