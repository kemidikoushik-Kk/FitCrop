package com.fitcorp.goal;

import com.fitcorp.exception.ResourceNotFoundException;
import com.fitcorp.goal.dto.GoalDto;
import com.fitcorp.goal.dto.UpdateUserGoalsRequest;
import com.fitcorp.profile.UserProfile;
import com.fitcorp.profile.UserProfileRepository;
import com.fitcorp.user.User;
import com.fitcorp.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GoalService {

    private final FitnessGoalRepository fitnessGoalRepository;
    private final UserGoalRepository userGoalRepository;
    private final UserRepository userRepository;
    private final UserProfileRepository userProfileRepository;

    @Transactional(readOnly = true)
    public List<GoalDto> getAllActiveGoals() {
        return fitnessGoalRepository.findByIsActiveTrue().stream()
                .map(g -> GoalDto.builder()
                        .id(g.getId())
                        .code(g.getCode())
                        .title(g.getTitle())
                        .description(g.getDescription())
                        .iconName(g.getIconName())
                        .recommendedFocus(g.getRecommendedFocus())
                        .expectedMetrics(g.getExpectedMetrics())
                        .build())
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<GoalDto> getUserGoals(String userId) {
        return userGoalRepository.findByUserId(userId).stream()
                .map(ug -> GoalDto.builder()
                        .id(ug.getGoal().getId())
                        .code(ug.getGoal().getCode())
                        .title(ug.getGoal().getTitle())
                        .description(ug.getGoal().getDescription())
                        .iconName(ug.getGoal().getIconName())
                        .recommendedFocus(ug.getGoal().getRecommendedFocus())
                        .expectedMetrics(ug.getGoal().getExpectedMetrics())
                        .isPrimary(ug.getIsPrimary())
                        .targetDate(ug.getTargetDate())
                        .notes(ug.getNotes())
                        .build())
                .collect(Collectors.toList());
    }

    @Transactional
    public List<GoalDto> updateUserGoals(String userId, UpdateUserGoalsRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        FitnessGoal primaryGoal = fitnessGoalRepository.findByCode(request.getPrimaryGoalCode())
                .orElseThrow(() -> new ResourceNotFoundException("Goal not found with code: " + request.getPrimaryGoalCode()));

        userGoalRepository.deleteByUserId(userId);

        UserGoal primaryUserGoal = UserGoal.builder()
                .id(UUID.randomUUID().toString())
                .user(user)
                .goal(primaryGoal)
                .isPrimary(true)
                .targetDate(request.getTargetDate())
                .notes(request.getNotes())
                .build();
        userGoalRepository.save(primaryUserGoal);

        if (request.getSecondaryGoalCode() != null && !request.getSecondaryGoalCode().isBlank()
                && !request.getSecondaryGoalCode().equalsIgnoreCase(request.getPrimaryGoalCode())) {
            fitnessGoalRepository.findByCode(request.getSecondaryGoalCode()).ifPresent(secGoal -> {
                UserGoal secUserGoal = UserGoal.builder()
                        .id(UUID.randomUUID().toString())
                        .user(user)
                        .goal(secGoal)
                        .isPrimary(false)
                        .targetDate(request.getTargetDate())
                        .build();
                userGoalRepository.save(secUserGoal);
            });
        }

        // Also update primary goal in UserProfile
        userProfileRepository.findByUserId(userId).ifPresent(profile -> {
            profile.setPrimaryFitnessGoal(request.getPrimaryGoalCode());
            profile.setSecondaryGoal(request.getSecondaryGoalCode());
            userProfileRepository.save(profile);
        });

        return getUserGoals(userId);
    }
}
