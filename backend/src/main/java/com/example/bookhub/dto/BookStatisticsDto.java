package com.example.bookhub.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class BookStatisticsDto {

    private int readCount;

    private int wantToReadCount;
}
