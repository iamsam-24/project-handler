package com.lackji.project2.core.security.filter;

import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;

import javax.sql.rowset.serial.SerialException;
import java.awt.desktop.PreferencesEvent;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;


public class RateLimitingFilter implements Filter {

    //get a limit how many times the rate limiter is applicable for
   private static final int MAX_COUNT_PER_MIN= 20    ;

    private final Map<String, AtomicInteger> requestCounts= new ConcurrentHashMap<>();
    //HashMap is not synchronized and is unsafe for multi-threaded use,
    // whereas ConcurrentHashMap is internally synchronized for concurrent reads and writes

//using atomic interger removes the idea of basically countingg manually like count++
    //atomic intger overcomes the problem when wee are involved in a multi threadin environment
    //andd java is a multi threaded language

    @Override
    public void doFilter(ServletRequest request,
                         ServletResponse response,
                         FilterChain chain
                         ) throws IOException, ServletException{

        HttpServletRequest httpRequest= (HttpServletRequest) request;

        HttpServletResponse httpResponse= (HttpServletResponse) response;


        //get the client ip address to chack and verify if the request coming from same  client or not
        String clientIp=httpRequest.getRemoteAddr();

        requestCounts.putIfAbsent(clientIp,new AtomicInteger(0));
        //now maintain the count and get the request count

        int currentCount=  requestCounts.get(clientIp).incrementAndGet();
        System.out.println("RATE LIMITER HIT: " + currentCount);

        if(currentCount>MAX_COUNT_PER_MIN){
            System.out.println("RATE LIMIT EXCEEDED!");
            httpResponse.setStatus(429);
            //rate limiteer nott working beccause i was sending send error when it was changed to setstatus it sttarted to wrok
            httpResponse.setContentType("application/json");
            httpResponse.getWriter().write(
                    "Too many request"
            );
            return;
        }
        chain.doFilter(request,response);
        System.out.println("rate imiter");


    }



}
