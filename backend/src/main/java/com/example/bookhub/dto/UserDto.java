package com.example.bookhub.dto;

import com.example.bookhub.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
public class UserDto {

    private long id;

    private String username;

    private Role role;
}
