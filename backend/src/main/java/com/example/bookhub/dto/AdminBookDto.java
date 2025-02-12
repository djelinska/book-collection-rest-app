package com.example.bookhub.dto;

import com.example.bookhub.enums.EbookFormat;
import com.example.bookhub.enums.Genre;
import com.example.bookhub.enums.Language;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class AdminBookDto {

    private Long id;

    private String title;

    private String author;

    private String publisher;

    private String isbn;

    private int publicationYear;

    private Genre genre;

    private int pageCount;

    private Language language;

    private String description;

    private String imagePath;

    @JsonProperty("isEbook")
    private boolean isEbook;

    private EbookFormat ebookFormat;

    private Double ebookFileSize;

    private String ebookLink;
}
