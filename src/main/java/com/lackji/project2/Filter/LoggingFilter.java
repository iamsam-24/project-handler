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



        //adding the errors logging ...
        //if someother method is called or any exception related error that will be logged



        try {
            filterChain.doFilter(servletRequest,servletResponse);




        }
        catch (IOException |ServletException |RuntimeException e){



            e.printStackTrace();
            throw e;

        }


        finally{
//            System.out.println("Response Status :" + httpServletResponse.getStatus());//aftercompletion interceptor
            System.out.println("Incoming Request Method :" +httpServletRequest.getMethod());
            System.out.println("Endpoint URI :" +httpServletRequest.getRequestURI());

            long duration = System.currentTimeMillis() - startTime;
            System.out.println("API response Time :" + duration);//elasped time
        }
    }


}
