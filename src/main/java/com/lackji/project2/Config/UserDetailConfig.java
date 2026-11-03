package com.lackji.project2.Config;

import ch.qos.logback.core.encoder.Encoder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.provisioning.UserDetailsManager;

import java.util.Arrays;

@Configuration
public class UserDetailConfig {



    PasswordEncoder passwordEncoder;

    public UserDetailConfig(PasswordEncoder passwordEncoder) {
        this.passwordEncoder = passwordEncoder;
    }

    @Bean
    public UserDetailsManager userDetailsManager(){
        InMemoryUserDetailsManager manager= new InMemoryUserDetailsManager();


        manager.createUser(
                User.withUsername("admin")
                        .password((passwordEncoder.encode("admin"))).
                        roles("ADMIN").build()


        );

        manager.createUser(
                User.withUsername("user")
                        .password(passwordEncoder.encode("user")).roles("USER").build()
        );

        return manager;


    }



}
