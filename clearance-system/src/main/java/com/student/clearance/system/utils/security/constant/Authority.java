package com.student.clearance.system.utils.security.constant;

public class Authority {
    public static final String[] STUDENT_AUTHORITIES = {"user:read"};
    public static final String[] DEPARTMENT_AUTHORITIES = {"user:read", "user:update"};
    public static final String[] SUPER_ADMIN_AUTHORITIES = {"user:read", "user:create", "user:update", "user:delete"};
}
