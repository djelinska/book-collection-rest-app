package com.example.bookhub.service;

import com.example.bookhub.dto.ReviewFormDto;
import com.example.bookhub.entity.Book;
import com.example.bookhub.entity.Review;
import com.example.bookhub.entity.User;
import com.example.bookhub.repository.ReviewRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;

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
        reviewRepository.save(review);
    }

    public void editReview(Long id, ReviewFormDto reviewFormDto) {
        Review existingReview = getReviewById(id);

        Review updatedReview = convertToEntity(reviewFormDto, existingReview);
        reviewRepository.save(updatedReview);
    }

    public void deleteReview(Long id) {
        reviewRepository.deleteById(id);
    }

    public void deleteUserReviews(User user) {
        List<Review> reviews = reviewRepository.findByUser(user);
        reviewRepository.deleteAll(reviews);
    }

    public Review convertToEntity(ReviewFormDto reviewFormDto, Review review) {
        if (review == null) {
            review = new Review();
        }
        review.setRating(reviewFormDto.getRating());
        review.setContent(reviewFormDto.getContent());
        return review;
    }
}
