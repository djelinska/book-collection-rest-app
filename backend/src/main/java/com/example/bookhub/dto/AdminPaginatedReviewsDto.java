package com.example.bookhub.dto;

import lombok.Data;

import java.util.List;

@Data
public class AdminPaginatedReviewsDto {

    private List<AdminReviewDto> reviews;

    private int totalPages;

    private long totalElements;

    private int currentPage;
}
