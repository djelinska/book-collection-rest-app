package com.example.bookhub.controller;

import com.example.bookhub.dto.ShelfDetailsDto;
import com.example.bookhub.dto.ShelfFormDto;
import com.example.bookhub.dto.ShelfListDto;
import com.example.bookhub.entity.Book;
import com.example.bookhub.entity.Shelf;
import com.example.bookhub.entity.User;
import com.example.bookhub.enums.ShelfType;
import com.example.bookhub.service.ShelfService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/shelves")
@RequiredArgsConstructor
public class ShelfController {

    private final ShelfService shelfService;

    @GetMapping
    public ResponseEntity<List<ShelfListDto>> getUserShelves(@AuthenticationPrincipal User user) {
        List<Shelf> shelves = shelfService.getShelvesForUser(user);
        List<ShelfListDto> shelfDtos = shelves.stream().map(shelfService::convertToListDto).toList();
        return ResponseEntity.ok(shelfDtos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ShelfDetailsDto> getUserShelfById(@PathVariable Long id, @AuthenticationPrincipal User user) {
        Shelf shelf = shelfService.getShelfById(id);
        if (!shelf.getUser().equals(user)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        ShelfDetailsDto shelfDto = shelfService.convertToDetailsDto(shelf);
        return ResponseEntity.ok(shelfDto);
    }

    @GetMapping("/{id}/books")
    public ResponseEntity<List<ShelfDetailsDto.BookDto>> getBooksForShelf(@PathVariable Long id, @AuthenticationPrincipal User user) {
        Shelf shelf = shelfService.getShelfById(id);
        if (!shelf.getUser().equals(user)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        List<Book> books = shelf.getBooks();
        List<ShelfDetailsDto.BookDto> bookDtos = books.stream()
                .map(book -> {
                    ShelfDetailsDto.BookDto bookDto = new ShelfDetailsDto.BookDto();
                    bookDto.setId(book.getId());
                    bookDto.setTitle(book.getTitle());
                    bookDto.setAuthor(book.getAuthor());
                    return bookDto;
                })
                .toList();
        return ResponseEntity.ok(bookDtos);
    }

    @PostMapping
    public ResponseEntity<Void> createUserShelf(@RequestBody ShelfFormDto shelfFormDto, @AuthenticationPrincipal User user) {
        shelfService.addShelf(shelfFormDto, user);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Void> updateUserShelf(@PathVariable Long id, @RequestBody ShelfFormDto shelfFormDto, @AuthenticationPrincipal User user) {
        Shelf shelf = shelfService.getShelfById(id);
        if (!shelf.getUser().equals(user) || shelf.getType() != ShelfType.DEFAULT) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        shelfService.editShelf(id, shelfFormDto);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUserShelf(@PathVariable Long id, @AuthenticationPrincipal User user) {
        Shelf shelf = shelfService.getShelfById(id);
        if (!shelf.getUser().equals(user) || shelf.getType() != ShelfType.DEFAULT) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        shelfService.deleteShelf(id);
        return ResponseEntity.ok().build();
    }
}
