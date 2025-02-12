package com.example.bookhub.validator;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.*;

@Documented
@Constraint(validatedBy = EbookValidator.class)
@Target({ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
public @interface EbookConstraint {
    String message() default "Jeśli książka jest e-bookiem, należy podać format, rozmiar pliku i link.";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}
