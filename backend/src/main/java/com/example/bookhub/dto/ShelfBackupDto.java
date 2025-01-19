package com.example.bookhub.dto;

import lombok.Data;

import java.util.List;

@Data
public class ShelfBackupDto {

    private String name;

    private List<Long> bookIds;
}
