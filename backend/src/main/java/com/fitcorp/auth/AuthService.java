package com.fitcorp.auth;

import com.fitcorp.auth.dto.AuthResponse;
import com.fitcorp.auth.dto.LoginRequest;
import com.fitcorp.auth.dto.RefreshTokenRequest;
import com.fitcorp.auth.dto.RegisterRequest;
import com.fitcorp.exception.BadRequestException;
import com.fitcorp.exception.ConflictException;
import com.fitcorp.exception.ResourceNotFoundException;
import com.fitcorp.exception.UnauthorizedException;
import com.fitcorp.notification.NotificationPreference;
import com.fitcorp.notification.NotificationPreferenceRepository;
import com.fitcorp.profile.UserProfile;
import com.fitcorp.profile.UserProfileRepository;
import com.fitcorp.security.JwtTokenProvider;
import com.fitcorp.security.UserPrincipal;
import com.fitcorp.user.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final UserProfileRepository userProfileRepository;
    private final NotificationPreferenceRepository notificationPreferenceRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new BadRequestException("Password and confirm password do not match");
        }

        if (userRepository.existsByEmail(request.getEmail().toLowerCase().trim())) {
            throw new ConflictException("An account with this email already exists");
        }

        Role userRole = roleRepository.findByName("ROLE_USER")
                .orElseGet(() -> roleRepository.save(Role.builder()
                        .id(UUID.randomUUID().toString())
                        .name("ROLE_USER")
                        .description("Standard User")
                        .build()));

        Set<Role> roles = new HashSet<>();
        roles.add(userRole);

        String userId = UUID.randomUUID().toString();
        User user = User.builder()
                .id(userId)
                .email(request.getEmail().toLowerCase().trim())
                .fullName(request.getFullName().trim())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .isActive(true)
                .isEmailVerified(true)
                .onboardingCompleted(false)
                .roles(roles)
                .build();

        userRepository.save(user);

        // Initialize user profile
        UserProfile profile = UserProfile.builder()
                .id(UUID.randomUUID().toString())
                .user(user)
                .fitnessLevel("BEGINNER")
                .primaryFitnessGoal("GENERAL_FITNESS")
                .availableWorkoutMinutes(30)
                .equipmentAccess("NONE")
                .dietaryPreference("NO_PREFERENCE")
                .activityLevel("SEDENTARY")
                .timezone("Asia/Kolkata")
                .workingDays("MON,TUE,WED,THU,FRI")
                .build();
        userProfileRepository.save(profile);

        // Initialize notification preferences
        NotificationPreference preferences = NotificationPreference.builder()
                .id(UUID.randomUUID().toString())
                .user(user)
                .workoutReminders(true)
                .mealReminders(true)
                .waterReminders(true)
                .weeklyProgressReminders(true)
                .reminderLeadMinutes(15)
                .build();
        notificationPreferenceRepository.save(preferences);

        // Create initial access and refresh tokens
        String accessToken = tokenProvider.generateAccessTokenForUser(
                user.getId(),
                user.getEmail(),
                user.getFullName(),
                "ROLE_USER",
                false
        );

        String refreshToken = createAndSaveRefreshToken(user);

        log.info("New user registered successfully: {}", user.getEmail());

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .expiresInMs(tokenProvider.getAccessExpirationMs())
                .user(AuthResponse.UserSummary.builder()
                        .id(user.getId())
                        .email(user.getEmail())
                        .fullName(user.getFullName())
                        .roles(Set.of("ROLE_USER"))
                        .onboardingCompleted(false)
                        .build())
                .build();
    }

    @Transactional
    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail().toLowerCase().trim(),
                        request.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();

        User user = userRepository.findById(userPrincipal.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!user.getIsActive()) {
            throw new UnauthorizedException("Your account has been deactivated. Please contact support.");
        }

        String accessToken = tokenProvider.generateAccessToken(authentication);
        String refreshToken = createAndSaveRefreshToken(user);

        Set<String> roles = userPrincipal.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toSet());

        log.info("User logged in successfully: {}", user.getEmail());

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .expiresInMs(tokenProvider.getAccessExpirationMs())
                .user(AuthResponse.UserSummary.builder()
                        .id(user.getId())
                        .email(user.getEmail())
                        .fullName(user.getFullName())
                        .roles(roles)
                        .onboardingCompleted(user.getOnboardingCompleted())
                        .build())
                .build();
    }

    @Transactional
    public AuthResponse refreshToken(RefreshTokenRequest request) {
        RefreshToken storedToken = refreshTokenRepository.findByTokenHash(request.getRefreshToken())
                .orElseThrow(() -> new UnauthorizedException("Invalid refresh token"));

        if (storedToken.getIsRevoked()) {
            throw new UnauthorizedException("Refresh token has been revoked");
        }

        if (storedToken.getExpiresAt().isBefore(Instant.now())) {
            refreshTokenRepository.delete(storedToken);
            throw new UnauthorizedException("Refresh token has expired. Please log in again.");
        }

        User user = storedToken.getUser();
        if (!user.getIsActive()) {
            throw new UnauthorizedException("User account is inactive");
        }

        // Revoke old token and issue a new rotated refresh token
        storedToken.setIsRevoked(true);
        refreshTokenRepository.save(storedToken);

        String newRefreshToken = createAndSaveRefreshToken(user);

        String roles = user.getRoles().stream()
                .map(Role::getName)
                .collect(Collectors.joining(","));

        String newAccessToken = tokenProvider.generateAccessTokenForUser(
                user.getId(),
                user.getEmail(),
                user.getFullName(),
                roles,
                user.getOnboardingCompleted()
        );

        Set<String> roleSet = user.getRoles().stream()
                .map(Role::getName)
                .collect(Collectors.toSet());

        return AuthResponse.builder()
                .accessToken(newAccessToken)
                .refreshToken(newRefreshToken)
                .tokenType("Bearer")
                .expiresInMs(tokenProvider.getAccessExpirationMs())
                .user(AuthResponse.UserSummary.builder()
                        .id(user.getId())
                        .email(user.getEmail())
                        .fullName(user.getFullName())
                        .roles(roleSet)
                        .onboardingCompleted(user.getOnboardingCompleted())
                        .build())
                .build();
    }

    @Transactional
    public void logout(String refreshToken) {
        if (refreshToken != null && !refreshToken.isBlank()) {
            refreshTokenRepository.findByTokenHash(refreshToken).ifPresent(token -> {
                token.setIsRevoked(true);
                refreshTokenRepository.save(token);
            });
        }
    }

    private String createAndSaveRefreshToken(User user) {
        String tokenValue = UUID.randomUUID().toString() + "-" + UUID.randomUUID().toString();
        Instant expiryDate = Instant.now().plusMillis(tokenProvider.getRefreshExpirationMs());

        RefreshToken refreshToken = RefreshToken.builder()
                .id(UUID.randomUUID().toString())
                .user(user)
                .tokenHash(tokenValue)
                .expiresAt(expiryDate)
                .isRevoked(false)
                .build();

        refreshTokenRepository.save(refreshToken);
        return tokenValue;
    }
}
