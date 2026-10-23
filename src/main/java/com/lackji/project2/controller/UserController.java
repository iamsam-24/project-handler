package com.lackji.project2.controller;


import com.lackji.project2.entity.User;
import com.lackji.project2.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/users")
public class UserController {

    UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping

    public ResponseEntity<String> createUser(@RequestBody User user ){

        userService.createUser(user);
        return ResponseEntity.ok("User Created");
    }


    @GetMapping("/{id}")
    public ResponseEntity<User> getUser(@PathVariable UUID id){

        User user= userService.findUserById(id);
        if(user==null){
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(user);
    }

    @DeleteMapping("/{id}")

    public ResponseEntity<String> removeUser(@PathVariable UUID id){
        userService.removeUser(id);
        return ResponseEntity.ok("User Deleted");

    }


}
