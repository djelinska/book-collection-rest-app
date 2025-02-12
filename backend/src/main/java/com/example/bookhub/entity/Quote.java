package com.example.bookhub.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.ToString;

@Data
@Entity
@Table(name = "quotes")
public class Quote {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Lob
    private String text;

    private Integer page;

    @ToString.Exclude
    @ManyToOne
    @JoinColumn(name = "review_id")
    private Review review;
}
