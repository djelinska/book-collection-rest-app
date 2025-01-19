package com.example.bookhub.controller;

import com.example.bookhub.dto.*;
import com.example.bookhub.entity.User;
import com.example.bookhub.enums.Role;
import com.example.bookhub.exception.UserAlreadyExistsException;
import com.example.bookhub.service.ReviewService;
import com.example.bookhub.service.ShelfService;
import com.example.bookhub.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final UserService userService;
    private final HttpServletRequest httpServletRequest;
    private final HttpServletResponse httpServletResponse;
    private final ShelfService shelfService;
    private final ReviewService reviewService;

    private ResponseEntity<?> handleValidationErrors(BindingResult result) {
        if (result.hasErrors()) {
            List<ValidationErrorDto> errors = result.getFieldErrors().stream()
                    .map(fieldError -> new ValidationErrorDto(fieldError.getField(), fieldError.getDefaultMessage()))
                    .toList();
            return ResponseEntity.badRequest().body(errors);
        }
        return null;
    }

    @GetMapping("/users")
    public ResponseEntity<AdminPaginatedUsersDto> listUsers(
            @RequestParam(required = false) String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size) {

        Pageable pageable = PageRequest.of(page, size);
        Page<User> usersPage = userService.searchUsers(query, pageable);

        List<AdminUserDto> adminUserDtos = usersPage.map(user -> {
            AdminUserDto dto = new AdminUserDto();
            dto.setId(user.getId());
            dto.setUsername(user.getUsername());
            dto.setRole(user.getRole());
            return dto;
        }).getContent();

        AdminPaginatedUsersDto adminPaginatedUsersDto = new AdminPaginatedUsersDto();
        adminPaginatedUsersDto.setUsers(adminUserDtos);
        adminPaginatedUsersDto.setTotalPages(usersPage.getTotalPages());
        adminPaginatedUsersDto.setTotalElements(usersPage.getTotalElements());
        adminPaginatedUsersDto.setCurrentPage(usersPage.getNumber());

        return ResponseEntity.ok(adminPaginatedUsersDto);
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<AdminUserDto> getUser(@PathVariable Long id) {
        User user = userService.getUserById(id);
        AdminUserDto adminUserDto = new AdminUserDto();
        adminUserDto.setId(user.getId());
        adminUserDto.setUsername(user.getUsername());
        adminUserDto.setRole(user.getRole());
        return ResponseEntity.ok(adminUserDto);
    }

    @PostMapping("/users")
    public ResponseEntity<?> createUser(@Valid @RequestBody AdminUserCreateDto adminUserCreateDto, BindingResult result) {
        ResponseEntity<?> validationResponse = handleValidationErrors(result);
        if (validationResponse != null) {
            return validationResponse;
        }

        if (userService.usernameExists(adminUserCreateDto.getUsername())) {
            throw new UserAlreadyExistsException(adminUserCreateDto.getUsername());
        }

        User user = userService.createUser(adminUserCreateDto);
        shelfService.initializeUserShelves(user);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PutMapping("/users/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @Valid @RequestBody AdminUserUpdateDto adminUserUpdateDto, BindingResult result, @AuthenticationPrincipal User loggedInUser) {
        User user = userService.getUserById(id);

        ResponseEntity<?> validationResponse = handleValidationErrors(result);
        if (validationResponse != null) {
            return validationResponse;
        }

        if (userService.usernameExists(adminUserUpdateDto.getUsername(), id)) {
            throw new UserAlreadyExistsException(adminUserUpdateDto.getUsername());
        }

        if (!adminUserUpdateDto.getRole().equals(Role.ROLE_ADMIN) && userService.isUserLastAdmin(id)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
        userService.updateUser(user, adminUserUpdateDto);

        if (loggedInUser.getId().equals(id)) {
            SecurityContextLogoutHandler logoutHandler = new SecurityContextLogoutHandler();
            logoutHandler.logout(httpServletRequest, httpServletResponse, SecurityContextHolder.getContext().getAuthentication());
        }
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<Object> deleteUser(@PathVariable Long id, @AuthenticationPrincipal User user) {
        if (user.getId().equals(id)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
        User existingUser = userService.getUserById(id);
        shelfService.deleteUserShelves(existingUser);
        reviewService.deleteUserReviews(existingUser);
        userService.deleteUser(id);
        return ResponseEntity.ok().build();
    }
}
