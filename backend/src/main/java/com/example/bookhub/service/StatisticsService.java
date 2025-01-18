package com.example.bookhub.service;

import com.example.bookhub.dto.BookStatisticsDto;
import com.example.bookhub.dto.UserStatisticsDto;
import com.example.bookhub.entity.Book;
import com.example.bookhub.entity.Shelf;
import com.example.bookhub.entity.User;
import com.example.bookhub.enums.ShelfType;
import com.example.bookhub.repository.ShelfRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class StatisticsService {

    private final ShelfService shelfService;
    private final ShelfRepository shelfRepository;

    public UserStatisticsDto getShelvesStatsForUser(User user) {
        List<Shelf> userShelves = shelfService.getShelvesForUser(user);

        int booksRead = userShelves.stream()
                .filter(shelf -> shelf.getType() == ShelfType.READ)
                .mapToInt(shelf -> shelf.getBooks().size())
                .sum();

        int booksToRead = userShelves.stream()
                .filter(shelf -> shelf.getType() == ShelfType.WANT_TO_READ)
                .mapToInt(shelf -> shelf.getBooks().size())
                .sum();
        int shelvesCreated = userShelves.size();

        return new UserStatisticsDto(booksRead, booksToRead, shelvesCreated);
    }

    public BookStatisticsDto getBookStatistics(Book book) {
        int readCount = shelfRepository.countByBooksContainingAndType(book, ShelfType.READ);
        int wantToReadCount = shelfRepository.countByBooksContainingAndType(book, ShelfType.WANT_TO_READ);

        return new BookStatisticsDto(readCount, wantToReadCount);
    }
}
