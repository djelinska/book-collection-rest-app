package com.example.bookhub.service;

import com.example.bookhub.dto.AdminReviewDto;
import com.example.bookhub.dto.AdminReviewFormDto;
import com.example.bookhub.dto.QuoteDto;
import com.example.bookhub.dto.ReviewFormDto;
import com.example.bookhub.entity.Book;
import com.example.bookhub.entity.Quote;
import com.example.bookhub.entity.Review;
import com.example.bookhub.entity.User;
import com.example.bookhub.repository.ReviewRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;

    public Page<Review> searchReviews(String query, Pageable pageable) {
        if ((query == null || query.trim().isEmpty())) {
            return reviewRepository.findAll(pageable);
        }
        return reviewRepository.findByContentContainingIgnoreCase(query, pageable);
    }

    public List<Review> getAllReviews() {
        return reviewRepository.findAll();
    }

    public Review getReviewById(Long id) {
        return reviewRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Review with id " + id + " not found"));
    }

    @Transactional
    public void addReview(Book book, ReviewFormDto reviewFormDto, User user) {
        Review review = convertToEntity(reviewFormDto, null);
        review.setBook(book);
        review.setUser(user);

        List<Quote> quotes = createQuoteEntities(reviewFormDto.getQuotes(), review);
        review.setQuotes(quotes);

        reviewRepository.save(review);
    }

    public void addReviewByAdmin(AdminReviewFormDto adminReviewFormDto, Book book, User user) {
        Review review = convertToAdminEntity(adminReviewFormDto, null);
        review.setBook(book);
        review.setUser(user);
        reviewRepository.save(review);
    }

    @Transactional
    public void editReview(Long id, ReviewFormDto reviewFormDto) {
        Review existingReview = getReviewById(id);

        existingReview.getQuotes().clear();
        List<Quote> newQuotes = createQuoteEntities(reviewFormDto.getQuotes(), existingReview);
        existingReview.getQuotes().addAll(newQuotes);

        existingReview.setRating(reviewFormDto.getRating());
        existingReview.setContent(reviewFormDto.getContent());

        reviewRepository.save(existingReview);
    }

    public void editReviewByAdmin(Long id, AdminReviewFormDto adminReviewFormDto, Book book, User user) {
        Review existingReview = getReviewById(id);

        Review updatedReview = convertToAdminEntity(adminReviewFormDto, existingReview);
        updatedReview.setBook(book);
        updatedReview.setUser(user);

        reviewRepository.save(updatedReview);
    }

    public void deleteReview(Long id) {
        reviewRepository.deleteById(id);
    }

    public void deleteBookReviews(Long bookId) {
        List<Review> reviews = reviewRepository.findByBookId(bookId);
        reviewRepository.deleteAll(reviews);
    }

    public void deleteUserReviews(User user) {
        List<Review> reviews = reviewRepository.findByUser(user);
        reviewRepository.deleteAll(reviews);
    }

    public AdminReviewDto convertToAdminDto(Review review) {
        AdminReviewDto dto = new AdminReviewDto();
        dto.setId(review.getId());
        dto.setRating(review.getRating());
        dto.setContent(review.getContent());

        AdminReviewDto.BookDto bookDto = new AdminReviewDto.BookDto(review.getBook().getId(), review.getBook().getTitle());
        dto.setBook(bookDto);

        AdminReviewDto.UserDto userDto = new AdminReviewDto.UserDto(review.getUser().getId(), review.getUser().getUsername());
        dto.setAuthor(userDto);

        dto.setCreatedAt(review.getCreatedAt());
        dto.setUpdatedAt(review.getUpdatedAt());
        return dto;
    }

    public Review convertToEntity(ReviewFormDto reviewFormDto, Review review) {
        if (review == null) {
            review = new Review();
        }
        review.setRating(reviewFormDto.getRating());
        review.setContent(reviewFormDto.getContent());
        return review;
    }

    public Review convertToAdminEntity(AdminReviewFormDto adminReviewFormDto, Review review) {
        if (review == null) {
            review = new Review();
        }
        review.setRating(adminReviewFormDto.getRating());
        review.setContent(adminReviewFormDto.getContent());
        return review;
    }

    private List<Quote> createQuoteEntities(List<QuoteDto> quoteDtos, Review review) {
        if (quoteDtos == null || quoteDtos.isEmpty()) {
            return Collections.emptyList();
        }

        return quoteDtos.stream()
                .map(dto -> {
                    Quote quote = new Quote();
                    quote.setText(dto.getText());
                    quote.setPage(dto.getPage());
                    quote.setReview(review);
                    return quote;
                })
                .toList();
    }
}
