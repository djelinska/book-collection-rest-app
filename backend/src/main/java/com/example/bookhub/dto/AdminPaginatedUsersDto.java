package com.example.bookhub.dto;

import lombok.Data;

import java.util.List;

@Data
public class AdminPaginatedUsersDto {

    private List<AdminUserDto> users;

    private int totalPages;

    private long totalElements;

    private int currentPage;
}
