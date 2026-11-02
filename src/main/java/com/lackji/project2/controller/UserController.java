package com.lackji.project2.controller;


import com.lackji.project2.dto.UserRequestDto;
import com.lackji.project2.dto.UserResponseDto;
import com.lackji.project2.entity.User;
import com.lackji.project2.service.AuthService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.web.server.csrf.CsrfToken;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/users")
public class UserController {



    AuthService authService;

    public UserController( AuthService authService) {

        this.authService = authService;
    }

    @PostMapping("/register")

    public ResponseEntity<UserResponseDto> registerUser(@RequestBody UserRequestDto userRequestDto){

        UserResponseDto userResponseDto= authService.register(userRequestDto);

        return ResponseEntity.status(HttpStatus.CREATED).body(userResponseDto);
    }







    @GetMapping("/token")

    public CsrfToken getToken(CsrfToken csrfToken){
        return csrfToken;
    }

}
