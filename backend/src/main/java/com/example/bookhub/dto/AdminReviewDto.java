package com.example.bookhub.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class AdminReviewDto {

    private Long id;

    private int rating;

    private String content;

    private BookDto book;

    private UserDto author;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;


    @Data
    @AllArgsConstructor
    public static class BookDto {

        private Long id;

        private String title;
    }

    @Data
    @AllArgsConstructor
    public static class UserDto {

        private Long id;

        private String username;
    }
}
