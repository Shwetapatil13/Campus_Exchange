package com.campusexchange.service;

import com.campusexchange.dto.AuthResponse;
import com.campusexchange.dto.LoginRequest;
import com.campusexchange.dto.RegisterRequest;
import com.campusexchange.entity.Role;
import com.campusexchange.entity.User;
import com.campusexchange.exception.DuplicateResourceException;
import com.campusexchange.repository.UserRepository;
import com.campusexchange.security.JwtService;
import com.campusexchange.security.UserPrincipal;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Collections;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private JwtService jwtService;

    @InjectMocks
    private AuthService authService;

    private RegisterRequest registerRequest;
    private LoginRequest loginRequest;
    private User mockUser;

    @BeforeEach
    void setUp() {
        registerRequest = RegisterRequest.builder()
                .name("John Doe")
                .email("john@campus.edu")
                .password("password123")
                .college("Main Campus")
                .build();

        loginRequest = LoginRequest.builder()
                .email("john@campus.edu")
                .password("password123")
                .build();

        mockUser = User.builder()
                .id(1L)
                .name("John Doe")
                .email("john@campus.edu")
                .password("hashedPassword")
                .role(Role.USER)
                .college("Main Campus")
                .enabled(true)
                .build();
    }

    @Test
    @DisplayName("Should successfully register a new user")
    void testRegisterUser_Success() {
        when(userRepository.existsByEmail("john@campus.edu")).thenReturn(false);
        when(passwordEncoder.encode("password123")).thenReturn("hashedPassword");
        when(userRepository.save(any(User.class))).thenReturn(mockUser);
        when(jwtService.generateTokenForUser(1L, "john@campus.edu", "John Doe", "USER")).thenReturn("mock-jwt-token");

        AuthResponse response = authService.register(registerRequest);

        assertNotNull(response);
        assertEquals("mock-jwt-token", response.getToken());
        assertEquals("john@campus.edu", response.getEmail());
        assertEquals("John Doe", response.getName());
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    @DisplayName("Should throw DuplicateResourceException when registering existing email")
    void testRegisterUser_DuplicateEmail() {
        when(userRepository.existsByEmail("john@campus.edu")).thenReturn(true);

        assertThrows(DuplicateResourceException.class, () -> authService.register(registerRequest));
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    @DisplayName("Should successfully authenticate user login")
    void testLogin_Success() {
        UserPrincipal principal = new UserPrincipal(1L, "John Doe", "john@campus.edu", "hashedPassword", Collections.emptyList(), true);
        Authentication authentication = new UsernamePasswordAuthenticationToken(principal, null, principal.getAuthorities());

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).thenReturn(authentication);
        when(userRepository.findById(1L)).thenReturn(Optional.of(mockUser));
        when(jwtService.generateToken(authentication)).thenReturn("mock-jwt-token");

        AuthResponse response = authService.login(loginRequest);

        assertNotNull(response);
        assertEquals("mock-jwt-token", response.getToken());
        assertEquals("john@campus.edu", response.getEmail());
    }
}
