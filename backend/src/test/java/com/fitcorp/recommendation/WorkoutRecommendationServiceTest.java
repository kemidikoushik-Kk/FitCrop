package com.fitcorp.recommendation;

import com.fitcorp.exercise.Exercise;
import com.fitcorp.exercise.ExerciseRepository;
import com.fitcorp.profile.UserProfile;
import com.fitcorp.user.User;
import com.fitcorp.workout.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class WorkoutRecommendationServiceTest {

    @Mock
    private ExerciseRepository exerciseRepository;

    @Mock
    private WorkoutPlanRepository workoutPlanRepository;

    @Mock
    private WorkoutDayRepository workoutDayRepository;

    @Mock
    private WorkoutExerciseRepository workoutExerciseRepository;

    @InjectMocks
    private WorkoutRecommendationService workoutRecommendationService;

    private User sampleUser;
    private UserProfile beginnerBodyweightProfile;
    private List<Exercise> mockExercises;

    @BeforeEach
    void setUp() {
        sampleUser = User.builder()
                .id("test-user-1")
                .email("test@fitcorp.com")
                .fullName("Test User")
                .build();

        beginnerBodyweightProfile = UserProfile.builder()
                .id("profile-1")
                .user(sampleUser)
                .fitnessLevel("BEGINNER")
                .equipmentAccess("NONE")
                .primaryFitnessGoal("GENERAL_FITNESS")
                .availableWorkoutMinutes(20)
                .preferredWorkoutDays("MON,WED,FRI")
                .build();

        Exercise squat = Exercise.builder()
                .id("ex-1")
                .name("Bodyweight Squat")
                .category("STRENGTH")
                .muscleGroup("LEGS")
                .equipment("NONE")
                .difficulty("BEGINNER")
                .repsDefault(12)
                .setsDefault(3)
                .durationDefaultSeconds(60)
                .restSecondsDefault(60)
                .isActive(true)
                .build();

        Exercise pushup = Exercise.builder()
                .id("ex-2")
                .name("Push-Up")
                .category("STRENGTH")
                .muscleGroup("CHEST")
                .equipment("NONE")
                .difficulty("BEGINNER")
                .repsDefault(10)
                .setsDefault(3)
                .durationDefaultSeconds(60)
                .restSecondsDefault(60)
                .isActive(true)
                .build();

        Exercise plank = Exercise.builder()
                .id("ex-3")
                .name("Plank")
                .category("CORE")
                .muscleGroup("CORE")
                .equipment("NONE")
                .difficulty("BEGINNER")
                .repsDefault(1)
                .setsDefault(3)
                .durationDefaultSeconds(45)
                .restSecondsDefault(45)
                .isActive(true)
                .build();

        mockExercises = List.of(squat, pushup, plank);
    }

    @Test
    @DisplayName("Beginner user with no equipment receives only bodyweight beginner exercises")
    void shouldGenerateBeginnerBodyweightPlan() {
        when(workoutPlanRepository.findByUserIdAndStatus("test-user-1", "ACTIVE"))
                .thenReturn(Optional.empty());
        when(workoutPlanRepository.findTopByUserIdOrderByVersionDesc("test-user-1"))
                .thenReturn(Optional.empty());
        when(workoutPlanRepository.save(any(WorkoutPlan.class)))
                .thenAnswer(inv -> inv.getArgument(0));

        when(exerciseRepository.findCompatibleExercises(eq(List.of("BEGINNER")), eq(List.of("NONE"))))
                .thenReturn(mockExercises);

        WorkoutPlan plan = workoutRecommendationService.generatePlanForUser(beginnerBodyweightProfile);

        assertNotNull(plan);
        assertEquals("ACTIVE", plan.getStatus());
        assertEquals(1, plan.getVersion());
        assertEquals("GENERAL_FITNESS", plan.getGoal());

        verify(workoutPlanRepository).save(any(WorkoutPlan.class));
        verify(workoutDayRepository).saveAll(any());
    }

    @Test
    @DisplayName("Regenerating a plan increments version and archives prior plan")
    void shouldIncrementVersionOnRegeneration() {
        WorkoutPlan oldPlan = WorkoutPlan.builder()
                .id("old-plan-1")
                .user(sampleUser)
                .version(1)
                .status("ACTIVE")
                .build();

        when(workoutPlanRepository.findByUserIdAndStatus("test-user-1", "ACTIVE"))
                .thenReturn(Optional.of(oldPlan));
        when(workoutPlanRepository.findTopByUserIdOrderByVersionDesc("test-user-1"))
                .thenReturn(Optional.of(oldPlan));
        when(workoutPlanRepository.save(any(WorkoutPlan.class)))
                .thenAnswer(inv -> inv.getArgument(0));
        when(exerciseRepository.findCompatibleExercises(any(), any()))
                .thenReturn(mockExercises);

        WorkoutPlan newPlan = workoutRecommendationService.generatePlanForUser(beginnerBodyweightProfile);

        assertEquals("ARCHIVED", oldPlan.getStatus());
        assertEquals(2, newPlan.getVersion());
    }
}
