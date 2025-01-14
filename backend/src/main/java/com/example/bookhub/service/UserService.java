package com.example.bookhub.service;

import com.example.bookhub.dto.UserDto;
import com.example.bookhub.entity.User;
import com.example.bookhub.exception.UserNotFoundException;
import com.example.bookhub.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public UserDto getUserByUsername(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UserNotFoundException(username));

        return new UserDto(user.getUsername());
    }
}
