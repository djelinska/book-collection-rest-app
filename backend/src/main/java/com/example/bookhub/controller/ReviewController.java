package com.example.bookhub.controller;

import com.example.bookhub.dto.ReviewFormDto;
import com.example.bookhub.entity.Review;
import com.example.bookhub.entity.User;
import com.example.bookhub.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @PutMapping("/{id}")
    public ResponseEntity<Void> updateReview(@PathVariable Long id, @RequestBody ReviewFormDto reviewFormDto, @AuthenticationPrincipal User user) {
        Review review = reviewService.getReviewById(id);
        if (!review.getUser().equals(user)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        reviewService.editReview(id, reviewFormDto);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReview(@PathVariable Long id, @AuthenticationPrincipal User user) {
        Review review = reviewService.getReviewById(id);
        if (!review.getUser().equals(user)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        reviewService.deleteReview(id);
        return ResponseEntity.ok().build();
    }
}
