package com.example.bookhub.controller;

import com.example.bookhub.dto.BookDto;
import com.example.bookhub.dto.PaginatedBooksDto;
import com.example.bookhub.entity.Book;
import com.example.bookhub.enums.Genre;
import com.example.bookhub.enums.Language;
import com.example.bookhub.service.BookService;
import com.example.bookhub.service.FileService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/books")
@RequiredArgsConstructor
public class BookController {

    private final BookService bookService;
    private final FileService fileService;

    @GetMapping
    public ResponseEntity<List<BookDto>> getBooks() {
        List<Book> books = bookService.getAllBooks();
        List<BookDto> bookDtos = books.stream().map(bookService::convertToDto).toList();
        return ResponseEntity.ok(bookDtos);
    }

    @GetMapping("/search")
    public ResponseEntity<PaginatedBooksDto> listBooks(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) Genre genre,
            @RequestParam(required = false) Language language,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "2") int size,
            @RequestParam(defaultValue = "title") String sortField,
            @RequestParam(defaultValue = "asc") String sortDirection) {

        Sort sort = sortDirection.equalsIgnoreCase("asc") ? Sort.by(sortField).ascending() : Sort.by(sortField).descending();
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<Book> booksPage = bookService.searchBooks(query, genre, language, pageable);
        List<BookDto> books = booksPage.map(bookService::convertToDto).getContent();

        PaginatedBooksDto response = new PaginatedBooksDto();
        response.setBooks(books);
        response.setTotalPages(booksPage.getTotalPages());
        response.setTotalElements(booksPage.getTotalElements());
        response.setCurrentPage(booksPage.getNumber());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<BookDto> getBookById(@PathVariable Long id) {
        Book book = bookService.getBookById(id);
        BookDto bookDto = bookService.convertToDto(book);
        return ResponseEntity.ok(bookDto);
    }

    @PostMapping
    public ResponseEntity<BookDto> createBook(@RequestPart("book") BookDto bookDto, @RequestPart("image") MultipartFile image) throws Exception {
        if(image != null && !image.isEmpty() && fileService.isImageFileValid(image)) {
            String path = fileService.saveImage(image, bookDto.getTitle());
            bookDto.setImagePath(path);
        }

        bookService.addBook(bookDto);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<BookDto> updateBook(@PathVariable Long id, @RequestPart("book") BookDto bookDto, @RequestPart("image") MultipartFile image) throws Exception {
        if(image != null && !image.isEmpty() && fileService.isImageFileValid(image)) {
            String path = fileService.saveImage(image, bookDto.getTitle());
            bookDto.setImagePath(path);
        }

        bookService.editBook(id, bookDto);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<BookDto> deleteBook(@PathVariable Long id) {
        bookService.deleteBook(id);
        return ResponseEntity.ok().build();
    }
}
