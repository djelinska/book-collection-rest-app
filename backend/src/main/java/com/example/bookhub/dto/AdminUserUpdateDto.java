package com.example.bookhub.dto;

import com.example.bookhub.enums.Role;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AdminUserUpdateDto {

    @NotBlank(message = "Username is required")
    private String username;

    @NotNull(message = "User role is required")
    private Role role;
}
