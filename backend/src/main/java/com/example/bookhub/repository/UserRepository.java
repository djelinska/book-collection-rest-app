package com.example.bookhub.repository;

import com.example.bookhub.entity.User;
import com.example.bookhub.enums.Role;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);

    boolean existsByUsername(String username);

    Page<User> findByUsernameContainingIgnoreCase(String query, Pageable pageable);

    List<User> findByUsernameContainingIgnoreCase(String query);

    long countByRole(Role role);
}
