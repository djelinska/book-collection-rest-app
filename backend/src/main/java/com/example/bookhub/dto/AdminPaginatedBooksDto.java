package com.example.bookhub.dto;

import lombok.Data;

import java.util.List;

@Data
public class AdminPaginatedBooksDto {

    private List<AdminBookDto> books;

    private int totalPages;

    private long totalElements;

    private int currentPage;
}
