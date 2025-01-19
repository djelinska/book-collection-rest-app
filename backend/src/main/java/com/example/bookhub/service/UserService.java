package com.example.bookhub.service;

import com.example.bookhub.dto.AdminBookDto;
import com.example.bookhub.dto.AdminUserCreateDto;
import com.example.bookhub.dto.AdminUserDto;
import com.example.bookhub.dto.AdminUserUpdateDto;
import com.example.bookhub.entity.Book;
import com.example.bookhub.entity.User;
import com.example.bookhub.enums.Role;
import com.example.bookhub.exception.UserNotFoundException;
import com.example.bookhub.repository.ShelfRepository;
import com.example.bookhub.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public Page<User> searchUsers(String query, Pageable pageable) {
        if ((query == null || query.trim().isEmpty())) {
            return userRepository.findAll(pageable);
        }
        return userRepository.findByUsernameContainingIgnoreCase(query, pageable);
    }

    public List<User> searchUsers(String query) {
        if ((query == null || query.trim().isEmpty())) {
            return userRepository.findAll();
        }
        return userRepository.findByUsernameContainingIgnoreCase(query);
    }

    public User getUserByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new UserNotFoundException(username));
    }

    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("User with id " + id + " not found"));
    }

    public User createUser(AdminUserCreateDto adminUserCreateDto) {
        User user = new User();
        user.setUsername(adminUserCreateDto.getUsername());
        user.setRole(adminUserCreateDto.getRole() != null ? adminUserCreateDto.getRole() : Role.ROLE_USER);
        user.setPassword(passwordEncoder.encode(adminUserCreateDto.getPassword()));
        return userRepository.save(user);
    }

    public void updateUser(User existingUser, AdminUserUpdateDto adminUserUpdateDto) {
        existingUser.setUsername(adminUserUpdateDto.getUsername());
        existingUser.setRole(adminUserUpdateDto.getRole());
        userRepository.save(existingUser);
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    public boolean isUserLastAdmin(Long userId) {
        long adminCount = userRepository.countByRole(Role.ROLE_ADMIN);

        return adminCount <= 1 && getUserById(userId).getRole().equals(Role.ROLE_ADMIN);
    }

    public boolean usernameExists(String username) {
        return userRepository.findByUsername(username).isPresent();
    }

    public boolean usernameExists(String username, Long userId) {
        return userRepository.findByUsername(username)
                .filter(existingUser -> !existingUser.getId().equals(userId))
                .isPresent();
    }

    public AdminUserDto convertToAdminDto(User user) {
        AdminUserDto dto = new AdminUserDto();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setRole(user.getRole());
        return dto;
    }
}
