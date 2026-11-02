package com.lackji.project2.service;

import com.lackji.project2.entity.CustomUserDetail;

import com.lackji.project2.entity.User;
import com.lackji.project2.repository.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailService implements UserDetailsService {

  private UserRepository userRepository;

    public CustomUserDetailService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }


    //in here we got onlyy one method to override just make some changes like
    //returing the error and using the actual user repo method that is find by username
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user= userRepository.findByUsername(username)
                .orElseThrow(
                () ->new RuntimeException("User Not found")
        );

        //while implementing in same or other and returing the method in same file or other
        //always use new to return

        return new CustomUserDetail(user);
    }
}
