# BookHub

**BookHub** to aplikacja internetowa umożliwiająca użytkownikom przeglądanie, recenzowanie oraz zarządzanie książkami. Aplikacja posiada również panel administratora do zarządzania użytkownikami, książkami oraz recenzjami.

## Funkcjonalności

### Dla niezalogowanych użytkowników:

- Przeglądanie strony głównej z zachętą do rejestracji lub logowania.
- Dostęp do formularza rejestracji i logowania.

### Dla zalogowanych użytkowników:

- Przeglądanie listy książek z możliwością filtrowania, sortowania i paginacji.
- Tworzenie recenzji książek i ocenianie.
- Zarządzanie swoim profilem.

### Panel administratora:

- Przeglądanie listy użytkowników, książek i recenzji.
- Dodawanie, edytowanie i usuwanie pozycji z listy książek.
- Zarządzanie użytkownikami (np. usuwanie kont).
- Zarządzanie recenzjami (np. moderowanie treści).

## Technologie

- **Backend**: Spring Boot
- **Frontend**: Angular z wykorzystaniem Bootstrap 5
- **Baza danych**: MySQL
- **Zarządzanie bezpieczeństwem**: Spring Security

### Wymagania

- Node.js

- Angular CLI (wersja 17+)

- Java 17

- Gradle

- MySQL

### Instalacja i uruchomienie

#### Klonowanie repozytorium

```sh
git clone https://github.com/djelinska/book-collection-rest-app.git
cd book-collection-rest-app
```

#### Konfiguracja środowiska

Utwórz plik .env w katalogu backend/ i skonfiguruj zmienne środowiskowe według przykładowego pliku .env.example.

#### Install Dependencies (Backend)

```sh
cd backend
gradlew bootRun
```

#### Instalacja zależności (Frontend)

```sh
cd frontend
npm install
npm start
```

## Użycie

Otwórz przeglądarkę i przejdź do http://localhost:4200.
