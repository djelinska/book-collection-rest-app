package com.example.bookhub.repository;

import com.example.bookhub.entity.Review;
import com.example.bookhub.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.book.id = :bookId")
    Double calculateAverageRating(@Param("bookId") Long bookId);

    @Query("SELECT COUNT(r) FROM Review r WHERE r.book.id = :bookId")
    int countReviewsByBookId(@Param("bookId") Long bookId);

    List<Review> findByUser(User user);

    List<Review> findByBookId(Long bookId);

    Page<Review> findByContentContainingIgnoreCase(String query, Pageable pageable);
}
