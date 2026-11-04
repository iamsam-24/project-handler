package com.lackji.project2.controller;


import com.lackji.project2.dto.UserRequestDto;
import com.lackji.project2.dto.UserResponseDto;
import com.lackji.project2.entity.User;
import com.lackji.project2.service.AuthService;
import com.lackji.project2.service.UserService;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.server.csrf.CsrfToken;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/users")
public class UserController {



    AuthService authService;
    UserService userService;

    public UserController(AuthService authService, UserService userService) {

        this.authService = authService;
        this.userService = userService;
    }

    @PostMapping("/register")

    public ResponseEntity<UserResponseDto> registerUser(@Valid @RequestBody UserRequestDto userRequestDto){

        UserResponseDto userResponseDto= authService.register(userRequestDto);

        return ResponseEntity.status(HttpStatus.CREATED).body(userResponseDto);
    }



    @GetMapping("/hello")
    public String sayHello(Authentication authentication){
        return "HELLO  "+ authentication.getName();

    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable UUID id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }




}
