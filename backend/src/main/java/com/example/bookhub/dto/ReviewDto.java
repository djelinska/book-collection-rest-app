package com.example.bookhub.dto;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class ReviewDto {

    private Long id;

    private int rating;

    private String content;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    private String author;

    private List<QuoteDto> quotes;
}
