package com.example.zoo.Exceptions;


public final class AppExceptions {

    private AppExceptions() {}

    public static class ResourceNotFound extends RuntimeException {
        public ResourceNotFound(String message) {
            super(message);
        }
    }

    public static class AccessDenied extends RuntimeException {
        public AccessDenied(String message) {
            super(message);
        }
    }

    public static class InvalidRoute extends RuntimeException {
        public InvalidRoute(String message) {
            super(message);
        }
    }

    public static class BadRequest extends RuntimeException {
        public BadRequest(String message) {
            super(message);
        }
    }

    public static class AiServiceException extends RuntimeException {
        public AiServiceException(String message) {
            super(message);
        }
        public AiServiceException(String message, Throwable cause) {
            super(message, cause);
        }
    }
}