package com.example.bookhub.controller;

import com.example.bookhub.dto.UserLoginRequest;
import com.example.bookhub.dto.UserLoginResponse;
import com.example.bookhub.dto.UserRegisterRequest;
import com.example.bookhub.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<String> registerUser(@RequestBody UserRegisterRequest userRegisterRequest) {
        authService.register(userRegisterRequest);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PostMapping("/login")
    public ResponseEntity<UserLoginResponse> loginUser(@RequestBody UserLoginRequest userLoginRequest) {
        UserLoginResponse response = authService.login(userLoginRequest);
        return ResponseEntity.ok(response);
    }
}
