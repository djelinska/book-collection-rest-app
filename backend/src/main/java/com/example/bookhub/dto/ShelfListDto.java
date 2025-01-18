package com.example.bookhub.dto;

import com.example.bookhub.enums.ShelfType;
import lombok.Data;

@Data
public class ShelfListDto {

    private Long id;

    private String name;

    private ShelfType type;

    private int numberOfBooks;
}
