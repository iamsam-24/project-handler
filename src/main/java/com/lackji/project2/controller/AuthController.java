package com.lackji.project2.controller;


import com.lackji.project2.dto.LoginRequestDto;
import com.lackji.project2.dto.LoginResponseDto;
import com.lackji.project2.service.JwtService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class AuthController {

    private AuthenticationManager authenticationManager;

    private JwtService jwtService;

    public AuthController(AuthenticationManager authenticationManager, JwtService jwtService) {
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
    }

    @PostMapping("/login")

    public LoginResponseDto login(@RequestBody LoginRequestDto loginRequestDto){

        //first get the username and password for authentication using login reqeust dto

        Authentication authenticationRequest= UsernamePasswordAuthenticationToken.unauthenticated(
                loginRequestDto.getUsername(),
                loginRequestDto.getPassword()
        );

        Authentication authentication=
               authenticationManager.authenticate(authenticationRequest);

        //now generate token using jwt

        String token = jwtService.generateToken(authentication);

       return new LoginResponseDto(token);

    }




}
