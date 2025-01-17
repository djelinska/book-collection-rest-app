package com.example.bookhub.service;

import com.example.bookhub.dto.BookDto;
import com.example.bookhub.entity.Book;
import com.example.bookhub.enums.Genre;
import com.example.bookhub.enums.Language;
import com.example.bookhub.repository.BookRepository;
import com.example.bookhub.utils.BookSpecifications;
import jakarta.persistence.EntityNotFoundException;
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

    public void addBook(BookDto bookDto) {
        Book book = convertToEntity(bookDto, null);
        bookRepository.save(book);
    }

    public void editBook(Long id, BookDto bookDto) {
        Book existingBook = getBookById(id);

        String imagePath = bookDto.getImagePath() == null ? existingBook.getImagePath() : bookDto.getImagePath();
        bookDto.setImagePath(imagePath);

        Book updatedBook = convertToEntity(bookDto, existingBook);
        bookRepository.save(updatedBook);
    }

    public void deleteBook(Long id) {
        bookRepository.deleteById(id);
    }

    public BookDto convertToDto(Book book) {
        BookDto bookDto = new BookDto();
        bookDto.setId(book.getId());
        bookDto.setTitle(book.getTitle());
        bookDto.setAuthor(book.getAuthor());
        bookDto.setPublisher(book.getPublisher());
        bookDto.setIsbn(book.getIsbn());
        bookDto.setPublicationYear(book.getPublicationYear());
        bookDto.setGenre(book.getGenre());
        bookDto.setPageCount(book.getPageCount());
        bookDto.setLanguage(book.getLanguage());
        bookDto.setAverageRating(book.getAverageRating());
        bookDto.setNumberOfRatings(book.getNumberOfRatings());
        bookDto.setDescription(book.getDescription());
        bookDto.setImagePath(book.getImagePath());
        return bookDto;
    }

    public Book convertToEntity(BookDto bookDto, Book book) {
        if (book == null) {
            book = new Book();
        }
        book.setTitle(bookDto.getTitle());
        book.setAuthor(bookDto.getAuthor());
        book.setPublisher(bookDto.getPublisher());
        book.setIsbn(bookDto.getIsbn());
        book.setPublicationYear(bookDto.getPublicationYear());
        book.setGenre(bookDto.getGenre());
        book.setPageCount(bookDto.getPageCount());
        book.setLanguage(bookDto.getLanguage());
        book.setDescription(bookDto.getDescription());
        book.setImagePath(bookDto.getImagePath());
        return book;
    }
}
