package com.fitcorp.exercise;

import com.fitcorp.common.PageResponse;
import com.fitcorp.exception.ResourceNotFoundException;
import com.fitcorp.exercise.dto.ExerciseRequest;
import com.fitcorp.exercise.dto.ExerciseResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ExerciseService {

    private final ExerciseRepository exerciseRepository;

    @Transactional(readOnly = true)
    public PageResponse<ExerciseResponse> searchExercises(
            String query, String category, String muscleGroup, String equipment, String difficulty, Pageable pageable) {
        Page<Exercise> page = exerciseRepository.searchExercises(
                query, category, muscleGroup, equipment, difficulty, pageable);
        return PageResponse.from(page.map(ExerciseResponse::from));
    }

    @Transactional(readOnly = true)
    public ExerciseResponse getExerciseById(String id) {
        Exercise exercise = exerciseRepository.findByIdAndIsActiveTrue(id)
                .orElseThrow(() -> new ResourceNotFoundException("Exercise not found with id: " + id));
        return ExerciseResponse.from(exercise);
    }

    @Transactional
    public ExerciseResponse createExercise(ExerciseRequest request) {
        Exercise exercise = Exercise.builder()
                .id(UUID.randomUUID().toString())
                .name(request.getName().trim())
                .description(request.getDescription())
                .category(request.getCategory())
                .muscleGroup(request.getMuscleGroup())
                .equipment(request.getEquipment())
                .difficulty(request.getDifficulty())
                .estimatedCaloriesPerMinute(request.getEstimatedCaloriesPerMinute())
                .durationDefaultSeconds(request.getDurationDefaultSeconds() != null ? request.getDurationDefaultSeconds() : 60)
                .setsDefault(request.getSetsDefault() != null ? request.getSetsDefault() : 3)
                .repsDefault(request.getRepsDefault() != null ? request.getRepsDefault() : 10)
                .restSecondsDefault(request.getRestSecondsDefault() != null ? request.getRestSecondsDefault() : 60)
                .instructions(request.getInstructions())
                .safetyNotes(request.getSafetyNotes())
                .isActive(request.getIsActive() != null ? request.getIsActive() : true)
                .build();

        Exercise saved = exerciseRepository.save(exercise);
        return ExerciseResponse.from(saved);
    }

    @Transactional
    public ExerciseResponse updateExercise(String id, ExerciseRequest request) {
        Exercise exercise = exerciseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Exercise not found with id: " + id));

        exercise.setName(request.getName().trim());
        exercise.setDescription(request.getDescription());
        exercise.setCategory(request.getCategory());
        exercise.setMuscleGroup(request.getMuscleGroup());
        exercise.setEquipment(request.getEquipment());
        exercise.setDifficulty(request.getDifficulty());
        exercise.setEstimatedCaloriesPerMinute(request.getEstimatedCaloriesPerMinute());
        if (request.getDurationDefaultSeconds() != null) exercise.setDurationDefaultSeconds(request.getDurationDefaultSeconds());
        if (request.getSetsDefault() != null) exercise.setSetsDefault(request.getSetsDefault());
        if (request.getRepsDefault() != null) exercise.setRepsDefault(request.getRepsDefault());
        if (request.getRestSecondsDefault() != null) exercise.setRestSecondsDefault(request.getRestSecondsDefault());
        exercise.setInstructions(request.getInstructions());
        exercise.setSafetyNotes(request.getSafetyNotes());
        if (request.getIsActive() != null) exercise.setIsActive(request.getIsActive());

        Exercise updated = exerciseRepository.save(exercise);
        return ExerciseResponse.from(updated);
    }

    @Transactional
    public void deactivateExercise(String id) {
        Exercise exercise = exerciseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Exercise not found with id: " + id));
        exercise.setIsActive(false);
        exerciseRepository.save(exercise);
    }
}
