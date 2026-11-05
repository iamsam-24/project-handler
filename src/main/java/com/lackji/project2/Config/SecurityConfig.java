package com.lackji.project2.Config;

import com.lackji.project2.service.CustomUserDetailService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.crypto.password4j.BcryptPassword4jPasswordEncoder;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.*;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;
import org.springframework.security.web.SecurityFilterChain;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.util.Base64;


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


    //This bean is for the security filter chain and get rid of the csrf token here only
    //2 we can manage the session using session management from http security
    //3 we can choose whom to verify before accessing any thing like if we go to any websiite to signup we do not need
    //to pass through the secuirty ...or in any website where some part are accessible without even siging using authorization request
    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity httpSecurity,
            DaoAuthenticationProvider provider){
        httpSecurity.csrf(csrf->csrf.disable())
                .authenticationProvider(provider)
                .authorizeHttpRequests(auth ->
                        auth.requestMatchers("/api/users/register","/api/users/login").permitAll()
                                .requestMatchers(HttpMethod.DELETE, "/api/users/**",
                                        "/api/project/**",
                                        "/api/membership/**",
                                        "/api/organisation/**",
                                        "/api/task/**"

                                ).hasRole("ADMIN")
                                .requestMatchers(HttpMethod.POST,"/api/organisation",
                                        "/api/project/**",
                                        "/api/task/**"
                                        ).hasRole("ADMIN")
                                .requestMatchers("/api/membership/**",
                                        "/api/roles/**")
                                .hasRole("ADMIN")

                                .anyRequest().authenticated()

                        ).sessionManagement(session->
                                            session.sessionCreationPolicy(
                                                    SessionCreationPolicy.STATELESS
                                            )

                        ).oauth2ResourceServer(oauth2->oauth2.jwt(
                                jwt->jwt.jwtAuthenticationConverter(
                                        jwtAuthenticationConverter()
                                )
                        )


                        );

    return httpSecurity.build();
    }


    @Bean
    public JwtAuthenticationConverter jwtAuthenticationConverter() {

        JwtGrantedAuthoritiesConverter authoritiesConverter =
                new JwtGrantedAuthoritiesConverter();

        authoritiesConverter.setAuthoritiesClaimName(
                "authorities"
        );

        authoritiesConverter.setAuthorityPrefix("");

        JwtAuthenticationConverter
                authenticationConverter =
                new JwtAuthenticationConverter();

        authenticationConverter
                .setJwtGrantedAuthoritiesConverter(
                        authoritiesConverter
                );

        return authenticationConverter;
    }

    @Bean
    public SecretKey jwtSecretKey(
            @Value("${jwt.secret}") String secret) {

        byte[] decodedKey =
                Base64.getDecoder().decode(secret);

        return new SecretKeySpec(
                decodedKey,
                "HmacSHA256"
        );
    }

    @Bean
    public JwtEncoder jwtEncoder(
            SecretKey secretKey) {

        return NimbusJwtEncoder
                .withSecretKey(secretKey)
                .algorithm(MacAlgorithm.HS256)
                .build();
    }

    @Bean
    public JwtDecoder jwtDecoder(
            SecretKey secretKey,
            @Value("${jwt.issuer}") String issuer) {

        NimbusJwtDecoder decoder =
                NimbusJwtDecoder
                        .withSecretKey(secretKey)
                        .macAlgorithm(MacAlgorithm.HS256)
                        .build();

        decoder.setJwtValidator(
                JwtValidators.createDefaultWithIssuer(
                        issuer
                )
        );

        return decoder;
    }
    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration configuration) throws Exception {

        return configuration.getAuthenticationManager();
    }
}
