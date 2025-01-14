package com.example.bookhub.service;

import com.example.bookhub.dto.UserLoginRequest;
import com.example.bookhub.dto.UserLoginResponse;
import com.example.bookhub.dto.UserRegisterRequest;
import com.example.bookhub.entity.User;
import com.example.bookhub.enums.Role;
import com.example.bookhub.exception.InvalidCredentialsException;
import com.example.bookhub.exception.UserAlreadyExistsException;
import com.example.bookhub.exception.UserNotFoundException;
import com.example.bookhub.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;


    public void register(UserRegisterRequest userRegisterRequest) {
        var username = userRegisterRequest.getUsername();

        if (userRepository.existsByUsername(username)) {
            throw new UserAlreadyExistsException(username);
        }

        User user = new User();
        user.setUsername(userRegisterRequest.getUsername());
        user.setPassword(passwordEncoder.encode(userRegisterRequest.getPassword()));
        user.setRole(Role.ROLE_USER);

        userRepository.save(user);
    }

    public UserLoginResponse login(UserLoginRequest userLoginRequest) {
        try {
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(userLoginRequest.getUsername(), userLoginRequest.getPassword()));
        } catch (AuthenticationException e) {
            throw new InvalidCredentialsException("Invalid username or password");
        }

        Optional<User> userOptional = userRepository.findByUsername(userLoginRequest.getUsername());
        if (userOptional.isEmpty()) {
            throw new UserNotFoundException(userLoginRequest.getUsername());
        }

        User user = userOptional.get();
        String token = jwtService.generateTokenFromUsername(user);

        UserLoginResponse userLoginResponse = new UserLoginResponse();
        userLoginResponse.setToken(token);

        return userLoginResponse;
    }
}
