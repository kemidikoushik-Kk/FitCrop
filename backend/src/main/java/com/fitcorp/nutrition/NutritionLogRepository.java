package com.fitcorp.nutrition;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface NutritionLogRepository extends JpaRepository<NutritionLog, String> {
    Optional<NutritionLog> findByUserIdAndDate(String userId, LocalDate date);
    List<NutritionLog> findByUserIdAndDateBetweenOrderByDateAsc(String userId, LocalDate start, LocalDate end);
    List<NutritionLog> findByUserIdOrderByDateDesc(String userId);
    long countByUserId(String userId);
}
