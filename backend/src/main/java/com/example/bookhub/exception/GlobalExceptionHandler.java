package com.example.bookhub.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(InvalidCredentialsException.class)
    public ResponseEntity<Object> handleInvalidCredentialsException(InvalidCredentialsException e) {
        HttpStatus status = HttpStatus.UNAUTHORIZED;
        ErrorMessage errorMessage = new ErrorMessage(status, e.getMessage());
        return new ResponseEntity<>(errorMessage, status);
    }

    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<Object> handleUserNotFoundException(UserNotFoundException e) {
        HttpStatus status = HttpStatus.NOT_FOUND;
        ErrorMessage errorMessage = new ErrorMessage(status, e.getMessage());
        return new ResponseEntity<>(errorMessage, status);
    }

    @ExceptionHandler(UserAlreadyExistsException.class)
    public ResponseEntity<Object> handleUserAlreadyExistsException(UserAlreadyExistsException e) {
        HttpStatus status = HttpStatus.CONFLICT;
        ErrorMessage errorMessage = new ErrorMessage(status, e.getMessage());
        return new ResponseEntity<>(errorMessage, status);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Object> handleException(Exception e) {
        HttpStatus status = HttpStatus.INTERNAL_SERVER_ERROR;
        ErrorMessage errorMessage = new ErrorMessage(status, "An unexpected error occurred: " + e.getMessage());
        return new ResponseEntity<>(errorMessage, status);
    }

    @Getter
    static class ErrorMessage {
        private final int status;
        private final String message;

        public ErrorMessage(HttpStatus status, String message) {
            this.status = status.value();
            this.message = message;
        }
    }
}
