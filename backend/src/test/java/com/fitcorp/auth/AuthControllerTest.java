package com.fitcorp.auth;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fitcorp.auth.dto.AuthResponse;
import com.fitcorp.auth.dto.LoginRequest;
import com.fitcorp.auth.dto.RegisterRequest;
import com.fitcorp.exception.ConflictException;
import com.fitcorp.security.JwtAuthenticationFilter;
import com.fitcorp.security.JwtTokenProvider;
import com.fitcorp.security.UserDetailsServiceImpl;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Set;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AuthController.class)
@AutoConfigureMockMvc(addFilters = false)
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private AuthService authService;

    @MockBean
    private JwtTokenProvider jwtTokenProvider;

    @MockBean
    private UserDetailsServiceImpl userDetailsService;

    @MockBean
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Test
    @DisplayName("Valid registration returns 201 Created and auth token")
    void shouldRegisterSuccessfully() throws Exception {
        RegisterRequest request = RegisterRequest.builder()
                .fullName("Alex Morgan")
                .email("alex@fitcorp.com")
                .password("Password@123")
                .confirmPassword("Password@123")
                .build();

        AuthResponse authResponse = AuthResponse.builder()
                .accessToken("mock-jwt-token")
                .refreshToken("mock-refresh-token")
                .tokenType("Bearer")
                .expiresInMs(900000)
                .user(AuthResponse.UserSummary.builder()
                        .id("u-1")
                        .email("alex@fitcorp.com")
                        .fullName("Alex Morgan")
                        .roles(Set.of("ROLE_USER"))
                        .onboardingCompleted(false)
                        .build())
                .build();

        when(authService.register(any(RegisterRequest.class))).thenReturn(authResponse);

        mockMvc.perform(post("/api/v1/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.accessToken").value("mock-jwt-token"))
                .andExpect(jsonPath("$.data.user.email").value("alex@fitcorp.com"));
    }

    @Test
    @DisplayName("Duplicate email registration returns 409 Conflict")
    void shouldRejectDuplicateEmail() throws Exception {
        RegisterRequest request = RegisterRequest.builder()
                .fullName("Alex Morgan")
                .email("duplicate@fitcorp.com")
                .password("Password@123")
                .confirmPassword("Password@123")
                .build();

        when(authService.register(any(RegisterRequest.class)))
                .thenThrow(new ConflictException("An account with this email already exists"));

        mockMvc.perform(post("/api/v1/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.error.code").value("CONFLICT"));
    }

    @Test
    @DisplayName("Invalid registration payload returns 400 Bad Request")
    void shouldValidateRegistrationInputs() throws Exception {
        RegisterRequest invalidRequest = RegisterRequest.builder()
                .fullName("") // Blank name
                .email("invalid-email") // Bad email format
                .password("123") // Too short
                .confirmPassword("123")
                .build();

        mockMvc.perform(post("/api/v1/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidRequest)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.error.code").value("VALIDATION_ERROR"));
    }

    @Test
    @DisplayName("Valid login returns 200 OK and JWT token")
    void shouldLoginSuccessfully() throws Exception {
        LoginRequest request = LoginRequest.builder()
                .email("alex@fitcorp.com")
                .password("Password@123")
                .build();

        AuthResponse authResponse = AuthResponse.builder()
                .accessToken("mock-jwt-token")
                .refreshToken("mock-refresh-token")
                .tokenType("Bearer")
                .expiresInMs(900000)
                .user(AuthResponse.UserSummary.builder()
                        .id("u-1")
                        .email("alex@fitcorp.com")
                        .fullName("Alex Morgan")
                        .roles(Set.of("ROLE_USER"))
                        .onboardingCompleted(true)
                        .build())
                .build();

        when(authService.login(any(LoginRequest.class))).thenReturn(authResponse);

        mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.accessToken").value("mock-jwt-token"));
    }
}
