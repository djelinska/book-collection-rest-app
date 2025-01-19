package com.example.bookhub.validator;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Constraint(validatedBy = PublicationYearValidator.class)
@Target({ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)
public @interface PublicationYearConstraint {
    String message() default "Rok publikacji nie może być większy niż obecny rok";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}
