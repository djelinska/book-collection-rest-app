package com.example.bookhub.controller;

import com.example.bookhub.dto.BookStatisticsDto;
import com.example.bookhub.dto.UserStatisticsDto;
import com.example.bookhub.entity.Book;
import com.example.bookhub.entity.User;
import com.example.bookhub.service.BookService;
import com.example.bookhub.service.StatisticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/statistics")
@RequiredArgsConstructor
public class StatisticsController {

    private final StatisticsService statisticsService;
    private final BookService bookService;

    @GetMapping("/user")
    public ResponseEntity<UserStatisticsDto> getUserStatistics(@AuthenticationPrincipal User user) {
        UserStatisticsDto userStats = statisticsService.getShelvesStatsForUser(user);
        return ResponseEntity.ok(userStats);
    }

    @GetMapping("/book/{bookId}")
    public ResponseEntity<BookStatisticsDto> getBookStatistics(@PathVariable Long bookId) {
        Book book = bookService.getBookById(bookId);
        BookStatisticsDto bookStats = statisticsService.getBookStatistics(book);
        return ResponseEntity.ok(bookStats);
    }
}
