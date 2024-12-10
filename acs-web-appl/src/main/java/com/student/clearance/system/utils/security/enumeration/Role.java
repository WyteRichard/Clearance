package com.student.clearance.system.utils.security.enumeration;

import static com.student.clearance.system.utils.security.constant.Authority.*;

public enum Role {
    ROLE_STUDENT(STUDENT_AUTHORITIES),

    ROLE_ADVISER(ADVISER_AUTHORITIES),

    ROLE_CASHIER(CASHIER_AUTHORITIES),

    ROLE_CLINIC(CLINIC_AUTHORITIES),

    ROLE_COORDINATOR(COORDINATOR_AUTHORITIES),

    ROLE_DEAN(DEAN_AUTHORITIES),

    ROLE_GUIDANCE(GUIDANCE_AUTHORITIES),

    ROLE_LABORATORY(LABORATORY_AUTHORITIES),

    ROLE_LIBRARY(LIBRARY_AUTHORITIES),

    ROLE_REGISTRAR(REGISTRAR_AUTHORITIES),

    ROLE_SPIRITUAL(SPIRITUAL_AUTHORITIES),

    ROLE_AFFAIRS(AFFAIRS_AUTHORITIES),

    ROLE_DISCIPLINE(DISCIPLINE_AUTHORITIES),

    ROLE_COUNCIL(COUNCIL_AUTHORITIES),

    ROLE_ADMIN(ADMIN_AUTHORITIES);

    private String[] authorities;

    Role(String... authorities) {
        this.authorities = authorities;
    }

    public String[] getAuthorities() {
        return authorities;
    }
}
