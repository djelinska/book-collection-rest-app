package com.example.bookhub.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UserStatisticsDto {

    private int booksRead;

    private int booksToRead;

    private int shelvesCreated;
}
