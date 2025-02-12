package com.example.bookhub.validator;

import com.example.bookhub.dto.AdminBookFormDto;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import org.apache.commons.lang3.StringUtils;

public class EbookValidator implements ConstraintValidator<EbookConstraint, AdminBookFormDto> {

    @Override
    public boolean isValid(AdminBookFormDto book, ConstraintValidatorContext context) {
        if (!book.getIsEbook()) {
            return true;
        }

        boolean isValid = true;

        isValid &= validateField(context, book.getEbookFormat(), "ebookFormat", "Format e-booka jest wymagany");
        isValid &= validateEbookFileSize(context, book.getEbookFileSize());
        isValid &= validateField(context, StringUtils.isBlank(book.getEbookLink()) ? null : book.getEbookLink(),
                "ebookLink", "Link do e-booka jest wymagany");

        return isValid;
    }

    private boolean validateField(ConstraintValidatorContext context, Object value, String field, String message) {
        if (value == null) {
            context.buildConstraintViolationWithTemplate(message)
                    .addPropertyNode(field)
                    .addConstraintViolation();
            return false;
        }
        return true;
    }

    private boolean validateEbookFileSize(ConstraintValidatorContext context, Double size) {
        if (size == null || size < 0.1) {
            context.buildConstraintViolationWithTemplate(size == null
                            ? "Rozmiar pliku e-booka jest wymagany"
                            : "Rozmiar pliku e-booka musi być większy niż 0")
                    .addPropertyNode("ebookFileSize")
                    .addConstraintViolation();
            return false;
        }
        return true;
    }
}
