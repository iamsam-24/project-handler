package com.lackji.project2.service;

import com.lackji.project2.entity.User;
import com.lackji.project2.repository.MembershipRepository;
import com.lackji.project2.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final MembershipRepository membershipRepository;

    public UserService(UserRepository userRepository,
                       MembershipRepository membershipRepository) {
        this.userRepository = userRepository;
        this.membershipRepository = membershipRepository;
    }

    @Transactional
    public void deleteUser(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found: " + userId));

        membershipRepository.deleteByUserId(userId);
        userRepository.deleteRolesByUserId(userId);
        userRepository.delete(user);
    }
}
