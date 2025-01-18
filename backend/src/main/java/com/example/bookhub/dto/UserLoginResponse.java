package com.example.bookhub.dto;

import lombok.Data;

@Data
public class UserLoginResponse {

    private String token;

    private UserDto user;
}
