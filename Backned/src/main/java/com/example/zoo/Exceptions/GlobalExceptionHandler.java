package com.example.zoo.Exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(AppExceptions.ResourceNotFound.class)
    public ResponseEntity<ExceptionResponse> handleResourceNotFound(AppExceptions.ResourceNotFound ex) {
        ExceptionResponse response = ExceptionResponse.builder()
                .message(ex.getMessage())
                .status(HttpStatus.NOT_FOUND.value())
                .timestamp(LocalDateTime.now())
                .build();

        return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(AppExceptions.BadRequest.class)
    public ResponseEntity<ExceptionResponse> handleBadRequest(AppExceptions.BadRequest ex) {
        ExceptionResponse response = ExceptionResponse.builder()
                .message(ex.getMessage())
                .status(HttpStatus.BAD_REQUEST.value())
                .timestamp(LocalDateTime.now())
                .build();

        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(AppExceptions.InvalidRoute.class)
    public ResponseEntity<ExceptionResponse> handleInvalidRoute(AppExceptions.InvalidRoute ex) {
        ExceptionResponse response = ExceptionResponse.builder()
                .message(ex.getMessage())
                .status(HttpStatus.UNPROCESSABLE_ENTITY.value()) // קוד 422 - הבקשה תקינה אך לא ניתנת לביצוע לוגי
                .timestamp(LocalDateTime.now())
                .build();

        return new ResponseEntity<>(response, HttpStatus.UNPROCESSABLE_ENTITY);
    }

    @ExceptionHandler(AppExceptions.AccessDenied.class)
    public ResponseEntity<ExceptionResponse> handleAccessDenied(AppExceptions.AccessDenied ex) {
        ExceptionResponse response = ExceptionResponse.builder()
                .message(ex.getMessage())
                .status(HttpStatus.FORBIDDEN.value())
                .timestamp(LocalDateTime.now())
                .build();

        return new ResponseEntity<>(response, HttpStatus.FORBIDDEN);
    }

    @ExceptionHandler(AppExceptions.AiServiceException.class)
    public ResponseEntity<ExceptionResponse> handleAiServiceException(AppExceptions.AiServiceException ex) {
        ExceptionResponse response = ExceptionResponse.builder()
                .message(ex.getMessage())
                .status(HttpStatus.SERVICE_UNAVAILABLE.value())
                .timestamp(LocalDateTime.now())
                .build();

        return new ResponseEntity<>(response, HttpStatus.SERVICE_UNAVAILABLE);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ExceptionResponse> handleGeneralException(Exception ex) {
        ExceptionResponse response = ExceptionResponse.builder()
                .message("An internal server error occurred. Please try again later.")
                .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
                .timestamp(LocalDateTime.now())
                .build();

        ex.printStackTrace();

        return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}