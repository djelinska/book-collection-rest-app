package com.example.bookhub.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ReviewDto {

    private Long id;

    private int rating;

    private String content;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    private String author;
}
