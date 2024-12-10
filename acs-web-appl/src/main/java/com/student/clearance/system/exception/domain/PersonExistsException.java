package com.student.clearance.system.exception.domain;

public class PersonExistsException extends Exception {
    public PersonExistsException(String message) {
        super(message);
    }
}