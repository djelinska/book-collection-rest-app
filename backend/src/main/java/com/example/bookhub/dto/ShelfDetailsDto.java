package com.example.bookhub.dto;

import com.example.bookhub.enums.ShelfType;
import lombok.Data;

@Data
public class ShelfDetailsDto {

    private Long id;

    private String name;

    private ShelfType type;

    private int numberOfBooks;

    @Data
    public static class BookDto {

        private Long id;

        private String title;

        private String author;
    }
}
