package com.student.clearance.system.utils.security.constant;

public class Authority {
    public static final String[] STUDENT_AUTHORITIES = {"user:read"};
    public static final String[] ADVISER_AUTHORITIES = {"user:read", "user:update"};
    public static final String[] CASHIER_AUTHORITIES = {"user:read", "user:update"};
    public static final String[] CLINIC_AUTHORITIES = {"user:read", "user:update"};
    public static final String[] COORDINATOR_AUTHORITIES = {"user:read", "user:update"};
    public static final String[] DEAN_AUTHORITIES = {"user:read", "user:update"};
    public static final String[] GUIDANCE_AUTHORITIES = {"user:read", "user:update"};
    public static final String[] LABORATORY_AUTHORITIES = {"user:read", "user:update"};
    public static final String[] LIBRARY_AUTHORITIES = {"user:read", "user:update"};
    public static final String[] REGISTRAR_AUTHORITIES = {"user:read", "user:update"};
    public static final String[] SPIRITUAL_AUTHORITIES = {"user:read", "user:update"};
    public static final String[] AFFAIRS_AUTHORITIES = {"user:read", "user:update"};
    public static final String[] DISCIPLINE_AUTHORITIES = {"user:read", "user:update"};
    public static final String[] COUNCIL_AUTHORITIES = {"user:read", "user:update"};
    public static final String[] ADMIN_AUTHORITIES = {"user:read", "user:create", "user:update", "user:delete"};
}
