package com.example.bookhub.dto;

import lombok.Data;

import java.util.List;

@Data
public class UserBackupDto {

    private String username;

    private List<ShelfBackupDto> shelves;
}
