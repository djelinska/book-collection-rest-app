package com.example.bookhub.service;

import com.example.bookhub.dto.BookDetailsDto;
import com.example.bookhub.dto.BookFormDto;
import com.example.bookhub.dto.BookListDto;
import com.example.bookhub.dto.ShelfDto;
import com.example.bookhub.entity.Book;
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

    public List<Book> getAllBooks() {
        return bookRepository.findAll();
    }

    public Book getBookById(Long id) {
        return bookRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Book with id " + id + " not found"));
    }

    public void addBook(BookFormDto bookFormDto) {
        Book book = convertToEntity(bookFormDto, null);
        bookRepository.save(book);
    }

    public void editBook(Long id, BookFormDto bookFormDto) {
        Book existingBook = getBookById(id);

        String imagePath = bookFormDto.getImagePath() == null ? existingBook.getImagePath() : bookFormDto.getImagePath();
        bookFormDto.setImagePath(imagePath);

        Book updatedBook = convertToEntity(bookFormDto, existingBook);
        bookRepository.save(updatedBook);
    }

    public void deleteBook(Long id) {
        bookRepository.deleteById(id);
    }

    @Transactional
    public void updateBookRatings(Book book) {
        Double averageRating = reviewRepository.calculateAverageRating(book.getId());
        int totalRatings = reviewRepository.countReviewsByBookId(book.getId());

        book.setNumberOfRatings(totalRatings);
        book.setAverageRating(averageRating != null ? averageRating : 0.0);
        bookRepository.save(book);
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
                    return shelfDto;
                })
                .toList();
    }

    public Book convertToEntity(BookFormDto dto, Book book) {
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
        return book;
    }
}
