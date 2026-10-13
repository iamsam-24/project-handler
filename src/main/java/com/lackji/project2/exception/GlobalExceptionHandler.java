package com.lackji.project2.exception;

import com.lackji.project2.dto.Responsedto;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.boot.context.config.ConfigDataResourceNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;

@RestControllerAdvice
public class GlobalExceptionHandler {
//    @ExceptionHandler(ResourceNotFoundException.class);
//    public <ExceptionResponsedto> ResponseEntity<ExceptionResponsedto> handleResponseNotFoundException(
//            ConfigDataResourceNotFoundException ex, HttpServletRequest request
//    ){
//        ExceptionResponsedto exceptionResponse= new ExceptionResonsedto();
//
//    }

    //for runtime execption
    @ExceptionHandler(RuntimeException.class)

    public ResponseEntity<String> handleRuntimeException(RuntimeException ex, HttpServletRequest request){

        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
                .body(ex.getMessage());




    }



}
