//package com.lackji.project2.service;
//
//
//import com.lackji.project2.core.exception.DuplicateFoundException;
//import com.lackji.project2.entity.User;
//import com.lackji.project2.repository.MembershipRepository;
//import com.lackji.project2.repository.UserRepository;
//import jakarta.transaction.Transactional;
//import org.springframework.stereotype.Service;
//
//import java.util.UUID;
//
//@Service
//public class UserService {
//
//    UserRepository userRepository;
//    MembershipRepository membershipRepository;
//
//    public UserService(UserRepository userRepository, MembershipRepository membershipRepository) {
//        this.userRepository = userRepository;
//        this.membershipRepository=membershipRepository;
//    }
//
//
//    @Transactional
//    public void createUser(User user){
//
//        if(userExists(user)){
//            throw new DuplicateFoundException(
//                    "User with "+user.getName()+"already exists"
//            );
//        }
//        userRepository.save(user);
//    }
//
//    @Transactional
//
//    public User findUserById(UUID id){
//        return userRepository.findById(id);
//    }
//
//    @Transactional
//    public void removeUser(UUID id){
//        userRepository.remove(id);
//    }
//
//
//
//    public Boolean userExists(User user){
//        return userRepository.userExists(user.getName());
//    }
//
//
//
//
//}
