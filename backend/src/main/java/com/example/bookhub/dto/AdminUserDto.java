package com.example.bookhub.dto;

import com.example.bookhub.enums.Role;
import lombok.Data;

@Data
public class AdminUserDto {

    private Long id;

    private String username;

    private Role role;
}
