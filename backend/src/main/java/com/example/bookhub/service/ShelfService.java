package com.example.bookhub.service;

import com.example.bookhub.dto.ShelfDetailsDto;
import com.example.bookhub.dto.ShelfFormDto;
import com.example.bookhub.dto.ShelfListDto;
import com.example.bookhub.entity.Book;
import com.example.bookhub.entity.Shelf;
import com.example.bookhub.entity.User;
import com.example.bookhub.enums.ShelfType;
import com.example.bookhub.repository.ShelfRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ShelfService {

    private final ShelfRepository shelfRepository;

    public void initializeUserShelves(User user) {
        Shelf wantToRead = new Shelf();
        wantToRead.setName("Do przeczytania");
        wantToRead.setType(ShelfType.WANT_TO_READ);
        wantToRead.setUser(user);

        Shelf read = new Shelf();
        read.setName("Przeczytane");
        read.setType(ShelfType.READ);
        read.setUser(user);

        shelfRepository.save(wantToRead);
        shelfRepository.save(read);
    }

    public List<Shelf> getAllShelves() {
        return shelfRepository.findAll();
    }

    public Shelf getShelfById(Long id) {
        return shelfRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Shelf with id " + id + " not found"));
    }

    public List<Shelf> getShelvesForUser(User user) {
        return shelfRepository.findByUser(user);
    }

    public void addShelf(ShelfFormDto shelfFormDto, User user) {
        Shelf shelf = convertToEntity(shelfFormDto, null);
        shelf.setType(ShelfType.DEFAULT);
        shelf.setUser(user);
        shelfRepository.save(shelf);
    }

    public void editShelf(Long id, ShelfFormDto shelfFormDto) {
        Shelf existingShelf = getShelfById(id);

        Shelf updatedShelf= convertToEntity(shelfFormDto, existingShelf);
        shelfRepository.save(updatedShelf);
    }

    public void deleteShelf(Long id) {
        shelfRepository.deleteById(id);
    }

    public void addBookToShelf(Shelf shelf, Book book) {
        if (!shelf.getBooks().contains(book)) {
            shelf.getBooks().add(book);
            shelfRepository.save(shelf);
        }
    }

    public void removeBookFromShelf(Shelf shelf, Book book) {
        if (shelf.getBooks().contains(book)) {
            shelf.getBooks().remove(book);
            shelfRepository.save(shelf);
        }
    }

    public ShelfListDto convertToListDto(Shelf shelf) {
        ShelfListDto dto = new ShelfListDto();
        dto.setId(shelf.getId());
        dto.setName(shelf.getName());
        dto.setType(shelf.getType());
        dto.setNumberOfBooks(shelf.getBooks().size());
        return dto;
    }

    public ShelfDetailsDto convertToDetailsDto(Shelf shelf) {
        ShelfDetailsDto dto = new ShelfDetailsDto();
        dto.setId(shelf.getId());
        dto.setName(shelf.getName());
        dto.setType(shelf.getType());
        dto.setNumberOfBooks(shelf.getBooks().size());
        return dto;
    }

    public Shelf convertToEntity(ShelfFormDto shelfFormDto, Shelf shelf) {
        if (shelf == null) {
            shelf = new Shelf();
        }
        shelf.setName(shelfFormDto.getName());
        return shelf;
    }
}
