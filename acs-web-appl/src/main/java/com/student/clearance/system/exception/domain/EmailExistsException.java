package com.student.clearance.system.exception.domain;

public class EmailExistsException extends Exception {
    public EmailExistsException(String message) {
        super(message);
    }
}
