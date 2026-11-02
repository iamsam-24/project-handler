package com.lackji.project2.controller;


import com.lackji.project2.entity.Role;
import com.lackji.project2.service.RoleService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/roles")
public class RoleController {


    private RoleService roleService;

    public RoleController(RoleService roleService) {
        this.roleService = roleService;
    }

    @PostMapping

    public ResponseEntity<String> addRole(@RequestBody Role role){

        roleService.createRole(role);
        return ResponseEntity.status(HttpStatus.CREATED).body("Roles added");
    }
}
