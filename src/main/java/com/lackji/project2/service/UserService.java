package com.lackji.project2.service;


import com.lackji.project2.entity.User;
import com.lackji.project2.repository.MembershipRepository;
import com.lackji.project2.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class UserService {

    UserRepository userRepository;
    MembershipRepository membershipRepository;

    public UserService(UserRepository userRepository, MembershipRepository membershipRepository) {
        this.userRepository = userRepository;
        this.membershipRepository=membershipRepository;
    }


    @Transactional
    public void createUser(User user){
        userRepository.save(user);
    }

    @Transactional

    public User findUserById(UUID id){
        return userRepository.findById(id);
    }

    @Transactional
    public void removeUser(UUID id){
        userRepository.remove(id);
    }







}
