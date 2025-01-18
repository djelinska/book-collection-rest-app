package com.example.bookhub.controller;

import com.example.bookhub.dto.UserDto;
import com.example.bookhub.entity.User;
import com.example.bookhub.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
public class ProfileController {

    private final UserService userService;

    @GetMapping
    public ResponseEntity<UserDto> getUserProfile(@AuthenticationPrincipal User userDetails) {
        User user = userService.getUserByUsername(userDetails.getUsername());
        UserDto userDto = new UserDto();
        userDto.setUsername(user.getUsername());
        userDto.setRole(user.getRole());
        return ResponseEntity.ok(userDto);
    }
}
