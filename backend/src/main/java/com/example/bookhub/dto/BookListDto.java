package com.example.bookhub.dto;

import com.example.bookhub.enums.Genre;
import com.example.bookhub.enums.Language;
import lombok.Data;

import java.util.List;

@Data
public class BookListDto {

    private Long id;

    private String title;

    private String author;

    private Genre genre;

    private Language language;

    private double averageRating;

    private int numberOfRatings;

    private String description;

    private String imagePath;

    private List<ShelfDto> shelves;
}
