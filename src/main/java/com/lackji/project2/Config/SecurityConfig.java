package com.lackji.project2.Config;

import com.lackji.project2.service.CustomUserDetailService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.crypto.password4j.BcryptPassword4jPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;


@Configuration

public class SecurityConfig {


    @Bean
    public PasswordEncoder passwordEncoder(){
        return new BCryptPasswordEncoder();
    }

    //adding the security filter chain for basic authentication using dao


    //get this method call password encoder and customuserdetailservice
    @Bean
    public DaoAuthenticationProvider daoAuthenticationProvider(
            CustomUserDetailService customUserDetailService,
            PasswordEncoder passwordEncoder

    ){
        //fetch using dao and set it to password encoder

        DaoAuthenticationProvider provider=new DaoAuthenticationProvider(customUserDetailService);
        provider.setPasswordEncoder(passwordEncoder);

        return provider;

    }

    @Bean
    //This bean is for the security filter chain and get rid of the csrf token here only
    //2 we can manage the session using session management from http security
    //3 we can choose whom to verify before accessing any thing like if we go to any websiite to signup we do not need
    //to pass through the secuirty ...or in any website where some part are accessible without even siging using authorization request
    public SecurityFilterChain securityFilterChain(
            HttpSecurity httpSecurity,
            DaoAuthenticationProvider provider){
        httpSecurity.csrf(csrf->csrf.disable())
                .authenticationProvider(provider)
                .authorizeHttpRequests(auth ->
                        auth.requestMatchers("/api/users/register").permitAll()
                                .anyRequest().authenticated()
                        ).sessionManagement(session->
                                            session.sessionCreationPolicy(
                                                    SessionCreationPolicy.STATELESS
                                            )

                        );

    return httpSecurity.build();
    }
}
