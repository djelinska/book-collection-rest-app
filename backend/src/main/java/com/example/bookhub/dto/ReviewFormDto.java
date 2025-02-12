package com.example.bookhub.dto;

import lombok.Data;

import java.util.List;

@Data
public class ReviewFormDto {

    private Long id;

    private int rating;

    private String content;

    private List<QuoteDto> quotes;
}
