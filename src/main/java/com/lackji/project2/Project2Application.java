package com.lackji.project2;

import com.lackji.project2.core.security.filter.RateLimitingFilter;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class Project2Application {

	public static void main(String[] args) {
		SpringApplication.run(Project2Application.class, args);
		System.out.println("Hello Api");


	}
	@Bean
	public FilterRegistrationBean<RateLimitingFilter> rateLimitingFilter(){
		FilterRegistrationBean<RateLimitingFilter> registration = new FilterRegistrationBean<>();

		registration.setFilter(new RateLimitingFilter());
		registration.addUrlPatterns("/api/*");
		registration.setOrder(-101);
		return registration;


	}

}
