package com.student.clearance.system.repository.admin;

import com.student.clearance.system.domain.admin.Admin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AdminRepository extends JpaRepository<Admin, Long> {
    boolean existsByAdminNumberAndEmail(String adminNumber, String email);

    boolean existsByAdminNumber(String adminNumber);

    Admin findByAdminNumber(String adminNumber);
}
