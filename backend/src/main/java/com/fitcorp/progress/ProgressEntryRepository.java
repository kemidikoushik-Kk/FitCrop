package com.fitcorp.progress;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface ProgressEntryRepository extends JpaRepository<ProgressEntry, String> {
    Optional<ProgressEntry> findByUserIdAndDate(String userId, LocalDate date);
    List<ProgressEntry> findByUserIdOrderByDateDesc(String userId);
    List<ProgressEntry> findByUserIdAndDateBetweenOrderByDateAsc(String userId, LocalDate start, LocalDate end);
}
