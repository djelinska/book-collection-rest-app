package com.example.bookhub.service;

import com.example.bookhub.dto.*;
import com.example.bookhub.entity.Book;
import com.example.bookhub.entity.Shelf;
import com.example.bookhub.entity.User;
import com.example.bookhub.enums.Genre;
import com.example.bookhub.enums.Language;
import com.example.bookhub.repository.BookRepository;
import com.example.bookhub.repository.ReviewRepository;
import com.example.bookhub.utils.BookSpecifications;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BookService {

    private final BookRepository bookRepository;
    private final ReviewRepository reviewRepository;

    public Page<Book> searchBooks(String query, Genre genre, Language language, Pageable pageable) {
        Specification<Book> spec = Specification
                .where(BookSpecifications.hasQuery(query))
                .and(BookSpecifications.hasGenre(genre))
                .and(BookSpecifications.hasLanguage(language));

        return bookRepository.findAll(spec, pageable);
    }

    public Page<Book> searchBooks(String query, Pageable pageable) {
        Specification<Book> spec = BookSpecifications.hasQuery(query);
        return bookRepository.findAll(spec, pageable);
    }

    public List<Book> searchBooks(String query) {
        Specification<Book> spec = BookSpecifications.hasQuery(query);
        return bookRepository.findAll(spec);
    }

    public List<Book> getAllBooks() {
        return bookRepository.findAll();
    }

    public Book getBookById(Long id) {
        return bookRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Book with id " + id + " not found"));
    }

    public void addBook(AdminBookFormDto adminBookFormDto) {
        Book book = convertToEntity(adminBookFormDto, null);
        bookRepository.save(book);
    }

    public void editBook(Long id, AdminBookFormDto adminBookFormDto) {
        Book existingBook = getBookById(id);

        String imagePath = adminBookFormDto.getImagePath() == null ? existingBook.getImagePath() : adminBookFormDto.getImagePath();
        adminBookFormDto.setImagePath(imagePath);

        Book updatedBook = convertToEntity(adminBookFormDto, existingBook);
        bookRepository.save(updatedBook);
    }

    public void deleteBook(Long id) {
        bookRepository.deleteById(id);
    }

    @Transactional
    public void removeBookFromShelves(Long bookId) {
        Book book = getBookById(bookId);
        for (Shelf shelf : book.getShelves()) {
            shelf.getBooks().remove(book);
        }
        book.getShelves().clear();
    }

    @Transactional
    public void updateBookRatings(Book book) {
        Double averageRating = reviewRepository.calculateAverageRating(book.getId());
        int totalRatings = reviewRepository.countReviewsByBookId(book.getId());

        book.setNumberOfRatings(totalRatings);
        book.setAverageRating(averageRating != null ? averageRating : 0.0);
        bookRepository.save(book);
    }

    public AdminBookDto convertToAdminDto(Book book) {
        AdminBookDto dto = new AdminBookDto();
        dto.setId(book.getId());
        dto.setTitle(book.getTitle());
        dto.setAuthor(book.getAuthor());
        dto.setPublisher(book.getPublisher());
        dto.setIsbn(book.getIsbn());
        dto.setPublicationYear(book.getPublicationYear());
        dto.setGenre(book.getGenre());
        dto.setPageCount(book.getPageCount());
        dto.setLanguage(book.getLanguage());
        dto.setDescription(book.getDescription());
        dto.setImagePath(book.getImagePath());
        dto.setEbook(book.getIsEbook());
        dto.setEbookFormat(book.getEbookFormat());
        dto.setEbookFileSize(book.getEbookFileSize());
        dto.setEbookLink(book.getEbookLink());
        return dto;
    }

    public BookListDto convertToListDto(Book book, User user) {
        BookListDto dto = new BookListDto();
        dto.setId(book.getId());
        dto.setTitle(book.getTitle());
        dto.setAuthor(book.getAuthor());
        dto.setGenre(book.getGenre());
        dto.setLanguage(book.getLanguage());
        dto.setAverageRating(book.getAverageRating());
        dto.setNumberOfRatings(book.getNumberOfRatings());
        dto.setDescription(book.getDescription());
        dto.setImagePath(book.getImagePath());
        dto.setShelves(convertShelvesForBook(book, user));
        return dto;
    }

    public BookDetailsDto convertToDetailsDto(Book book, User user) {
        BookDetailsDto dto = new BookDetailsDto();
        dto.setId(book.getId());
        dto.setTitle(book.getTitle());
        dto.setAuthor(book.getAuthor());
        dto.setPublisher(book.getPublisher());
        dto.setIsbn(book.getIsbn());
        dto.setPublicationYear(book.getPublicationYear());
        dto.setGenre(book.getGenre());
        dto.setPageCount(book.getPageCount());
        dto.setLanguage(book.getLanguage());
        dto.setAverageRating(book.getAverageRating());
        dto.setNumberOfRatings(book.getNumberOfRatings());
        dto.setDescription(book.getDescription());
        dto.setImagePath(book.getImagePath());
        dto.setEbook(book.getIsEbook());
        dto.setEbookFormat(book.getEbookFormat());
        dto.setEbookFileSize(book.getEbookFileSize());
        dto.setEbookLink(book.getEbookLink());
        dto.setShelves(convertShelvesForBook(book, user));
        return dto;
    }

    private List<ShelfDto> convertShelvesForBook(Book book, User loggedInUser) {
        return book.getShelves().stream()
                .filter(shelf -> shelf.getUser().equals(loggedInUser))
                .map(shelf -> {
                    ShelfDto shelfDto  = new ShelfDto();
                    shelfDto.setId(shelf.getId());
                    shelfDto.setName(shelf.getName());
                    shelfDto.setType(shelf.getType());
                    return shelfDto;
                })
                .toList();
    }

    public Book convertToEntity(AdminBookFormDto dto, Book book) {
        if (book == null) {
            book = new Book();
        }
        book.setTitle(dto.getTitle());
        book.setAuthor(dto.getAuthor());
        book.setPublisher(dto.getPublisher());
        book.setIsbn(dto.getIsbn());
        book.setPublicationYear(dto.getPublicationYear());
        book.setGenre(dto.getGenre());
        book.setPageCount(dto.getPageCount());
        book.setLanguage(dto.getLanguage());
        book.setDescription(dto.getDescription());
        book.setImagePath(dto.getImagePath());
        book.setEbook(dto.getIsEbook());
        book.setEbookFormat(dto.getEbookFormat());
        book.setEbookFileSize(dto.getEbookFileSize());
        book.setEbookLink(dto.getEbookLink());
        return book;
    }
}
