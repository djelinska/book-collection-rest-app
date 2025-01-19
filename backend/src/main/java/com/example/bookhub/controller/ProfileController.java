package com.example.bookhub.controller;

import com.example.bookhub.dto.*;
import com.example.bookhub.entity.Book;
import com.example.bookhub.entity.Shelf;
import com.example.bookhub.entity.User;
import com.example.bookhub.enums.Role;
import com.example.bookhub.service.BookService;
import com.example.bookhub.service.ReviewService;
import com.example.bookhub.service.ShelfService;
import com.example.bookhub.service.UserService;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.nio.charset.StandardCharsets;
import java.util.List;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
public class ProfileController {

    private final UserService userService;
    private final ShelfService shelfService;
    private final ObjectMapper jacksonObjectMapper;
    private final BookService bookService;
    private final HttpServletRequest httpServletRequest;
    private final HttpServletResponse httpServletResponse;
    private final ReviewService reviewService;
    private final PasswordEncoder passwordEncoder;

    private ResponseEntity<?> handleValidationErrors(BindingResult result) {
        if (result.hasErrors()) {
            List<ValidationErrorDto> errors = result.getFieldErrors().stream()
                    .map(fieldError -> new ValidationErrorDto(fieldError.getField(), fieldError.getDefaultMessage()))
                    .toList();
            return ResponseEntity.badRequest().body(errors);
        }
        return null;
    }

    @GetMapping
    public ResponseEntity<UserDto> getUserProfile(@AuthenticationPrincipal User loggedInUser) {
        User user = userService.getUserByUsername(loggedInUser.getUsername());
        UserDto userDto = new UserDto();
        userDto.setUsername(user.getUsername());
        userDto.setRole(user.getRole());
        return ResponseEntity.ok(userDto);
    }

    @PatchMapping("/edit")
    public ResponseEntity<?> updateUserProfile(@Valid @RequestBody UserUpdateDto userUpdateDto, BindingResult result, @AuthenticationPrincipal User user) {
        ResponseEntity<?> validationResponse = handleValidationErrors(result);
        if (validationResponse != null) {
            return validationResponse;
        }

        if (!passwordEncoder.matches(userUpdateDto.getCurrentPassword(), user.getPassword())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }

        userService.updateUserPassword(userUpdateDto, user);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/delete")
    public ResponseEntity<Void> deleteAccount(@AuthenticationPrincipal User user) {
        if (user.getRole().equals(Role.ROLE_ADMIN)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }

        shelfService.deleteUserShelves(user);
        reviewService.deleteUserReviews(user);
        userService.deleteUser(user);

        SecurityContextLogoutHandler logoutHandler = new SecurityContextLogoutHandler();
        logoutHandler.logout(httpServletRequest, httpServletResponse, SecurityContextHolder.getContext().getAuthentication());

        return ResponseEntity.ok().build();
    }

    @GetMapping("/backup")
    public ResponseEntity<Resource> createBackup(@AuthenticationPrincipal User user) throws Exception {
        List<Shelf> shelves = shelfService.getShelvesForUser(user);
        byte[] backupData = userService.createBackup(shelves, user);

        Resource resource = new ByteArrayResource(backupData);
        String filename = "backup_" + user.getUsername() + ".json";

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_JSON)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                .body(resource);
    }

    @PostMapping("/import")
    public ResponseEntity<Void> importBackup(@RequestParam("file") MultipartFile file, @AuthenticationPrincipal User user) throws Exception {
        if (file == null || file.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }

        String contentType = file.getContentType();
        if (!"application/json".equals(contentType)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }

        shelfService.deleteUserShelves(user);
        shelfService.initializeUserShelves(user);

        String json = new String(file.getBytes(), StandardCharsets.UTF_8);

        UserBackupDto userBackupDto = jacksonObjectMapper.readValue(json, UserBackupDto.class);

        for (ShelfBackupDto shelfBackupDto : userBackupDto.getShelves()) {
            Shelf shelf = shelfService.getShelfByNameAndUser(shelfBackupDto.getName(), user);
            if (shelf == null) {
                shelf = new Shelf();
                shelf.setName(shelfBackupDto.getName());
                shelf.setUser(user);
                shelfService.saveShelf(shelf);
            }

            for (Long bookId : shelfBackupDto.getBookIds()) {
                Book book = bookService.getBookById(bookId);
                if (book != null) {
                    shelfService.addBookToShelf(shelf, book);
                }
            }
        }

        return ResponseEntity.ok().build();
    }
}
