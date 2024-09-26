package com.student.clearance.system.utils.security.enumeration;

import static com.student.clearance.system.utils.security.constant.Authority.*;

public enum Role {
    ROLE_STUDENT(STUDENT_AUTHORITIES),

    ROLE_DEPARTMENT(DEPARTMENT_AUTHORITIES),

    ROLE_SUPER_ADMIN(SUPER_ADMIN_AUTHORITIES);

    private String[] authorities;

    Role(String... authorities) {
        this.authorities = authorities;
    }

    public String[] getAuthorities() {
        return authorities;
    }
}
