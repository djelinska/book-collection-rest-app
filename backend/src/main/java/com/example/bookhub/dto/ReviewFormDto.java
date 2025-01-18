package com.example.bookhub.dto;

import lombok.Data;

@Data
public class ReviewFormDto {

    private Long id;

    private int rating;

    private String content;
}
