package com.fitcorp.goal;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FitnessGoalRepository extends JpaRepository<FitnessGoal, String> {
    List<FitnessGoal> findByIsActiveTrue();
    Optional<FitnessGoal> findByCode(String code);
}
