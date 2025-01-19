package com.example.bookhub.repository;

import com.example.bookhub.entity.Book;
import com.example.bookhub.entity.Shelf;
import com.example.bookhub.entity.User;
import com.example.bookhub.enums.ShelfType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ShelfRepository extends JpaRepository<Shelf, Long> {
    List<Shelf> findByUser(User user);

    int countByBooksContainingAndType(Book book, ShelfType type);

    Shelf findByNameAndUser(String name, User user);
}
