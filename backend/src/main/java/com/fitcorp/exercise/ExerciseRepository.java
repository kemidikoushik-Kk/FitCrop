package com.fitcorp.exercise;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ExerciseRepository extends JpaRepository<Exercise, String> {

    Optional<Exercise> findByIdAndIsActiveTrue(String id);

    Page<Exercise> findByIsActiveTrue(Pageable pageable);

    List<Exercise> findByIsActiveTrue();

    @Query("SELECT e FROM Exercise e WHERE e.isActive = true " +
            "AND (:query IS NULL OR LOWER(e.name) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(e.description) LIKE LOWER(CONCAT('%', :query, '%'))) " +
            "AND (:category IS NULL OR e.category = :category) " +
            "AND (:muscleGroup IS NULL OR e.muscleGroup = :muscleGroup) " +
            "AND (:equipment IS NULL OR e.equipment = :equipment) " +
            "AND (:difficulty IS NULL OR e.difficulty = :difficulty)")
    Page<Exercise> searchExercises(
            @Param("query") String query,
            @Param("category") String category,
            @Param("muscleGroup") String muscleGroup,
            @Param("equipment") String equipment,
            @Param("difficulty") String difficulty,
            Pageable pageable);

    @Query("SELECT e FROM Exercise e WHERE e.isActive = true " +
            "AND e.difficulty IN :difficulties " +
            "AND e.equipment IN :equipments")
    List<Exercise> findCompatibleExercises(
            @Param("difficulties") List<String> difficulties,
            @Param("equipments") List<String> equipments);
}
