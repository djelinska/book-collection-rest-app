package com.example.bookhub.controller;

import com.example.bookhub.dto.*;
import com.example.bookhub.entity.Book;
import com.example.bookhub.entity.Review;
import com.example.bookhub.entity.User;
import com.example.bookhub.enums.Genre;
import com.example.bookhub.enums.Language;
import com.example.bookhub.service.BookService;
import com.example.bookhub.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/books")
@RequiredArgsConstructor
public class BookController {

    private final BookService bookService;
    private final ReviewService reviewService;

    @GetMapping
    public ResponseEntity<List<BookListDto>> getBooks(@AuthenticationPrincipal User user) {
        List<Book> books = bookService.getAllBooks();
        List<BookListDto> bookDtos = books.stream().map(book -> bookService.convertToListDto(book, user)).toList();
        return ResponseEntity.ok(bookDtos);
    }

    @GetMapping("/search")
    public ResponseEntity<PaginatedBooksDto> listBooks(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) Genre genre,
            @RequestParam(required = false) Language language,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "2") int size,
            @RequestParam(defaultValue = "title") String sortField,
            @RequestParam(defaultValue = "asc") String sortDirection,
            @AuthenticationPrincipal User user) {

        Sort sort = sortDirection.equalsIgnoreCase("asc") ? Sort.by(sortField).ascending() : Sort.by(sortField).descending();
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<Book> booksPage = bookService.searchBooks(query, genre, language, pageable);
        List<BookListDto> books = booksPage.map(book -> bookService.convertToListDto(book, user)).getContent();

        PaginatedBooksDto response = new PaginatedBooksDto();
        response.setBooks(books);
        response.setTotalPages(booksPage.getTotalPages());
        response.setTotalElements(booksPage.getTotalElements());
        response.setCurrentPage(booksPage.getNumber());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<BookDetailsDto> getBookById(@PathVariable Long id, @AuthenticationPrincipal User user) {
        Book book = bookService.getBookById(id);
        BookDetailsDto bookDto = bookService.convertToDetailsDto(book, user);
        return ResponseEntity.ok(bookDto);
    }

    @GetMapping("/{id}/reviews")
    public ResponseEntity<List<ReviewDto>> getReviewsForBook(@PathVariable Long id, @AuthenticationPrincipal User user) {
        Book book = bookService.getBookById(id);
        List<Review> reviews = book.getReviews();
        List<ReviewDto> reviewDtos = reviews.stream()
                .map(review -> {
                    ReviewDto reviewDto = new ReviewDto();
                    reviewDto.setId(review.getId());
                    reviewDto.setRating(review.getRating());
                    reviewDto.setContent(review.getContent());
                    reviewDto.setCreatedAt(review.getCreatedAt());
                    reviewDto.setUpdatedAt(review.getUpdatedAt());
                    reviewDto.setAuthor(review.getUser().getUsername());
                    reviewDto.setQuotes(review.getQuotes().stream().map(quote -> {
                        QuoteDto quoteDto = new QuoteDto();
                        quoteDto.setText(quote.getText());
                        quoteDto.setPage(quote.getPage());
                        return quoteDto;
                    }).toList());
                    return reviewDto;
                })
                .toList();
        return ResponseEntity.ok(reviewDtos);
    }

    @PostMapping("/{id}/reviews")
    public ResponseEntity<Void> addReview(@PathVariable Long id, @RequestBody ReviewFormDto reviewFormDto, @AuthenticationPrincipal User user) {
        Book book = bookService.getBookById(id);
        reviewService.addReview(book, reviewFormDto, user);
        bookService.updateBookRatings(book);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }
}
