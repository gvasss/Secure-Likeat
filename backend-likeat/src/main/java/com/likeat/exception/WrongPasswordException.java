package com.likeat.exception;

public class WrongPasswordException extends RuntimeException {
    public WrongPasswordException() {
        super("Wrong password");
    }
}