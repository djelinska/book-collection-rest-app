package com.example.bookhub.repository;

import com.example.bookhub.entity.Shelf;
import com.example.bookhub.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ShelfRepository extends JpaRepository<Shelf, Long> {
    List<Shelf> findByUser(User user);
}
