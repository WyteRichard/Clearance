package com.student.clearance.system.exception.domain;

public class UsernameExistsException extends Exception {
    public UsernameExistsException(String message) {
        super(message);
    }
}
