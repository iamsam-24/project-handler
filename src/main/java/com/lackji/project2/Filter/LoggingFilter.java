package com.lackji.project2.Filter;

import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class LoggingFilter implements Filter {
    @Override
    public void doFilter(ServletRequest servletRequest,
                         ServletResponse servletResponse,
                         FilterChain filterChain
                         ) throws IOException, ServletException

    {

        //adding api response time
        long startTime=System.currentTimeMillis();

        HttpServletRequest httpServletRequest= (HttpServletRequest) servletRequest;

        HttpServletResponse httpServletResponse=(HttpServletResponse) servletResponse;

        System.out.println("Incoming Request Method :" +httpServletRequest.getMethod());

        System.out.println("Response Status :" +httpServletResponse.getStatus());

        System.out.println("Endpoint URI" +httpServletRequest.getRequestURI());

        filterChain.doFilter(servletRequest,servletResponse);

        long duration=System.currentTimeMillis()- startTime;

        System.out.println("API response Time :" +duration);
    }


}
