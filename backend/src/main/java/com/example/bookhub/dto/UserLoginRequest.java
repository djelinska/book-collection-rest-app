package com.example.bookhub.dto;


import lombok.Data;

@Data
public class UserLoginRequest {

    private String username;

    private String password;
}
