package com.example.bookhub.controller;

import com.example.bookhub.dto.*;
import com.example.bookhub.entity.Book;
import com.example.bookhub.entity.Review;
import com.example.bookhub.entity.User;
import com.example.bookhub.enums.Role;
import com.example.bookhub.exception.UserAlreadyExistsException;
import com.example.bookhub.service.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final UserService userService;
    private final HttpServletRequest httpServletRequest;
    private final HttpServletResponse httpServletResponse;
    private final ShelfService shelfService;
    private final ReviewService reviewService;
    private final BookService bookService;
    private final FileService fileService;

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

        List<AdminUserDto> adminUserDtos;
        int totalPages = 0;
        long totalElements = 0;

        if (size == -1) {
            List<User> users = userService.searchUsers(query);
            adminUserDtos = users.stream()
                    .map(userService::convertToAdminDto)
                    .collect(Collectors.toList());
            totalPages = 1;
            totalElements = users.size();
        } else {
            Pageable pageable = PageRequest.of(page, size);
            Page<User> usersPage = userService.searchUsers(query, pageable);
            adminUserDtos = usersPage.map(userService::convertToAdminDto).getContent();
            totalPages = usersPage.getTotalPages();
            totalElements = usersPage.getTotalElements();
        }

        AdminPaginatedUsersDto adminPaginatedUsersDto = new AdminPaginatedUsersDto();
        adminPaginatedUsersDto.setUsers(adminUserDtos);
        adminPaginatedUsersDto.setTotalPages(totalPages);
        adminPaginatedUsersDto.setTotalElements(totalElements);
        adminPaginatedUsersDto.setCurrentPage(page);

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
    @PreAuthorize("hasRole('ADMIN')")
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
    @PreAuthorize("hasRole('ADMIN')")
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
    @PreAuthorize("hasRole('ADMIN')")
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

    @GetMapping("/books")
    public ResponseEntity<AdminPaginatedBooksDto> listBooks(
            @RequestParam(required = false) String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size) {

        List<AdminBookDto> adminBookDtos;
        int totalPages = 0;
        long totalElements = 0;

        if (size == -1) {
            List<Book> books = bookService.searchBooks(query);
            adminBookDtos = books.stream()
                    .map(bookService::convertToAdminDto)
                    .collect(Collectors.toList());
            totalPages = 1;
            totalElements = books.size();
        } else {
            Pageable pageable = PageRequest.of(page, size);
            Page<Book> booksPage = bookService.searchBooks(query, pageable);
            adminBookDtos = booksPage.map(bookService::convertToAdminDto).getContent();
            totalPages = booksPage.getTotalPages();
            totalElements = booksPage.getTotalElements();
        }

        AdminPaginatedBooksDto adminPaginatedBooksDto = new AdminPaginatedBooksDto();
        adminPaginatedBooksDto.setBooks(adminBookDtos);
        adminPaginatedBooksDto.setTotalPages(totalPages);
        adminPaginatedBooksDto.setTotalElements(totalElements);
        adminPaginatedBooksDto.setCurrentPage(page);

        return ResponseEntity.ok(adminPaginatedBooksDto);
    }

    @GetMapping("/books/{id}")
    public ResponseEntity<AdminBookDto> getBook(@PathVariable Long id) {
        Book book = bookService.getBookById(id);
        AdminBookDto adminBookDto = bookService.convertToAdminDto(book);
        return ResponseEntity.ok(adminBookDto);
    }

    @PostMapping("/books")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createBook(@Valid @RequestPart("book") AdminBookFormDto adminBookFormDto, BindingResult result, @RequestPart("image") MultipartFile image) throws Exception {
        ResponseEntity<?> validationResponse = handleValidationErrors(result);
        if (validationResponse != null) {
            return validationResponse;
        }

        if(image != null && !image.isEmpty() && fileService.isImageFileValid(image)) {
            String path = fileService.saveImage(image, adminBookFormDto.getTitle());
            adminBookFormDto.setImagePath(path);
        }

        bookService.addBook(adminBookFormDto);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PutMapping("/books/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateBook(@PathVariable Long id, @Valid @RequestPart("book") AdminBookFormDto adminBookFormDto, BindingResult result, @RequestPart(value = "image", required = false) MultipartFile image) throws Exception {
        ResponseEntity<?> validationResponse = handleValidationErrors(result);
        if (validationResponse != null) {
            return validationResponse;
        }

        if(image != null && !image.isEmpty() && fileService.isImageFileValid(image)) {
            String path = fileService.saveImage(image, adminBookFormDto.getTitle());
            adminBookFormDto.setImagePath(path);
        }

        bookService.editBook(id, adminBookFormDto);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/books/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteBook(@PathVariable Long id) {
        bookService.deleteBook(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/reviews")
    public ResponseEntity<AdminPaginatedReviewsDto> listReviews(
            @RequestParam(required = false) String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size) {

        Pageable pageable = PageRequest.of(page, size);
        Page<Review> reviewsPage = reviewService.searchReviews(query, pageable);

        List<AdminReviewDto> adminReviewDtos = reviewsPage.map(reviewService::convertToAdminDto).getContent();

        AdminPaginatedReviewsDto adminPaginatedReviewsDto = new AdminPaginatedReviewsDto();
        adminPaginatedReviewsDto.setReviews(adminReviewDtos);
        adminPaginatedReviewsDto.setTotalPages(reviewsPage.getTotalPages());
        adminPaginatedReviewsDto.setTotalElements(reviewsPage.getTotalElements());
        adminPaginatedReviewsDto.setCurrentPage(reviewsPage.getNumber());

        return ResponseEntity.ok(adminPaginatedReviewsDto);
    }

    @GetMapping("/reviews/{id}")
    public ResponseEntity<AdminReviewDto> getReview(@PathVariable Long id) {
        Review review = reviewService.getReviewById(id);
        AdminReviewDto adminReviewDto = reviewService.convertToAdminDto(review);
        return ResponseEntity.ok(adminReviewDto);
    }

    @PostMapping("/reviews")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createReview(@Valid @RequestBody AdminReviewFormDto adminReviewFormDto, BindingResult result) {
        ResponseEntity<?> validationResponse = handleValidationErrors(result);
        if (validationResponse != null) {
            return validationResponse;
        }

        User user = userService.getUserById(adminReviewFormDto.getUserId());
        Book book = bookService.getBookById(adminReviewFormDto.getBookId());

        reviewService.addReviewByAdmin(adminReviewFormDto, book, user);
        bookService.updateBookRatings(book);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PutMapping("/reviews/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateReview(@PathVariable Long id, @Valid @RequestBody AdminReviewFormDto adminReviewFormDto, BindingResult result) {
        ResponseEntity<?> validationResponse = handleValidationErrors(result);
        if (validationResponse != null) {
            return validationResponse;
        }

        Review review = reviewService.getReviewById(id);
        Book reviewBook = review.getBook();
        User user = userService.getUserById(adminReviewFormDto.getUserId());
        Book book = bookService.getBookById(adminReviewFormDto.getBookId());

        reviewService.editReviewByAdmin(id, adminReviewFormDto, book, user);
        bookService.updateBookRatings(book);
        bookService.updateBookRatings(reviewBook);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/reviews/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteReview(@PathVariable Long id) {
        Review review = reviewService.getReviewById(id);
        Book book = review.getBook();

        reviewService.deleteReview(id);
        bookService.updateBookRatings(book);
        return ResponseEntity.ok().build();
    }
}
