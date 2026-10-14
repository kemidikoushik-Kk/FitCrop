package com.fitcorp.admin;

import com.fitcorp.admin.dto.AdminStatsResponse;
import com.fitcorp.admin.dto.AdminUserDto;
import com.fitcorp.admin.dto.UpdateUserRoleRequest;
import com.fitcorp.admin.dto.UpdateUserStatusRequest;
import com.fitcorp.common.PageResponse;
import com.fitcorp.exception.BadRequestException;
import com.fitcorp.exception.ResourceNotFoundException;
import com.fitcorp.exercise.ExerciseRepository;
import com.fitcorp.food.FoodItemRepository;
import com.fitcorp.nutrition.MealPlanRepository;
import com.fitcorp.user.Role;
import com.fitcorp.user.RoleRepository;
import com.fitcorp.user.User;
import com.fitcorp.user.UserRepository;
import com.fitcorp.workout.WorkoutLogRepository;
import com.fitcorp.workout.WorkoutPlanRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final WorkoutLogRepository workoutLogRepository;
    private final WorkoutPlanRepository workoutPlanRepository;
    private final MealPlanRepository mealPlanRepository;
    private final ExerciseRepository exerciseRepository;
    private final FoodItemRepository foodItemRepository;
    private final AuditLogRepository auditLogRepository;

    @Transactional(readOnly = true)
    public AdminStatsResponse getStats() {
        return AdminStatsResponse.builder()
                .totalUsers(userRepository.count())
                .activeUsers(userRepository.countByIsActiveTrue())
                .totalWorkoutsCompleted(workoutLogRepository.countAllCompleted())
                .totalPlansGenerated(workoutPlanRepository.count())
                .totalMealPlansGenerated(mealPlanRepository.count())
                .totalExercises(exerciseRepository.count())
                .totalFoods(foodItemRepository.count())
                .build();
    }

    @Transactional(readOnly = true)
    public PageResponse<AdminUserDto> getUsers(String query, Pageable pageable) {
        Page<User> users;
        if (query != null && !query.isBlank()) {
            users = userRepository.findByFullNameContainingIgnoreCaseOrEmailContainingIgnoreCase(
                    query.trim(), query.trim(), pageable);
        } else {
            users = userRepository.findAll(pageable);
        }

        return PageResponse.from(users.map(this::toAdminUserDto));
    }

    @Transactional
    public AdminUserDto updateUserStatus(String adminId, String targetUserId, UpdateUserStatusRequest request) {
        User user = userRepository.findById(targetUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + targetUserId));

        if (user.getId().equals(adminId)) {
            throw new BadRequestException("Administrators cannot deactivate their own account");
        }

        user.setIsActive(request.getIsActive());
        User saved = userRepository.save(user);

        logAudit(adminId, "UPDATE_USER_STATUS", "User", targetUserId,
                "Updated isActive to " + request.getIsActive());

        return toAdminUserDto(saved);
    }

    @Transactional
    public AdminUserDto updateUserRoles(String adminId, String targetUserId, UpdateUserRoleRequest request) {
        User user = userRepository.findById(targetUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + targetUserId));

        Set<Role> roles = new HashSet<>();
        for (String roleName : request.getRoles()) {
            Role role = roleRepository.findByName(roleName)
                    .orElseThrow(() -> new ResourceNotFoundException("Role not found: " + roleName));
            roles.add(role);
        }

        user.setRoles(roles);
        User saved = userRepository.save(user);

        logAudit(adminId, "UPDATE_USER_ROLES", "User", targetUserId,
                "Updated roles to " + request.getRoles());

        return toAdminUserDto(saved);
    }

    public void logAudit(String actorId, String action, String entityType, String entityId, String metadata) {
        AuditLog logEntry = AuditLog.builder()
                .id(UUID.randomUUID().toString())
                .actorUserId(actorId)
                .action(action)
                .entityType(entityType)
                .entityId(entityId)
                .metadata(metadata)
                .build();
        auditLogRepository.save(logEntry);
    }

    private AdminUserDto toAdminUserDto(User u) {
        Set<String> roles = u.getRoles().stream()
                .map(Role::getName)
                .collect(Collectors.toSet());

        return AdminUserDto.builder()
                .id(u.getId())
                .email(u.getEmail())
                .fullName(u.getFullName())
                .isActive(u.getIsActive())
                .isEmailVerified(u.getIsEmailVerified())
                .onboardingCompleted(u.getOnboardingCompleted())
                .roles(roles)
                .createdAt(u.getCreatedAt())
                .build();
    }
}
