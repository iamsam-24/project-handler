package com.lackji.project2.service;


import com.lackji.project2.entity.Role;
import com.lackji.project2.repository.RoleRepository;
import org.springframework.stereotype.Service;

@Service
public class RoleService {

    private RoleRepository roleRepository;

    public RoleService(RoleRepository roleRepository) {
        this.roleRepository = roleRepository;
    }


   public void createRole(Role role){
        roleRepository.save(role);
    }
}
