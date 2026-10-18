package com.lackji.project2.Interceptor;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.hibernate.annotations.Changelog;
import org.jspecify.annotations.Nullable;
import org.springframework.stereotype.Component;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

@Component
public class LoggingInterceptor implements HandlerInterceptor {

    public boolean preHandle(HttpServletRequest request,
                             HttpServletResponse response,
                             Object handler) {

        System.out.println("Client IP : "+request.getRemoteAddr());

        if (handler instanceof HandlerMethod method) {

            String controllerName = method.getBeanType().getName();
            String methodName = method.getMethod().getName();
            System.out.println("Incoming Request...");
            System.out.println("ControllerName : " + controllerName);
            System.out.println("MethodName : " + methodName);



        }
        return true;


    }

//        HandlerMethod method= (HandlerMethod) handler; //this can create issue of typecasting


        //this controller name and method name ...like


        public void postHandle (HttpServletRequest request,
                HttpServletResponse response,
                Object handler,
                @Nullable ModelAndView modelAndView) throws Exception {
            System.out.println("postHandle called");
//
//            System.out.println("Controller executed successfully");
//            System.out.println("Endpoint: " + request.getRequestURI());

        }

        public void afterCompletion (HttpServletRequest request,
                HttpServletResponse response,
                Object handler,
                Exception ex) throws Exception {
            System.out.println("after Completion called");
            System.out.println("Response Status: " + response.getStatus());

            if(ex!=null){
                System.out.println("Request failed : " +ex.getMessage());
            }
        }

}
