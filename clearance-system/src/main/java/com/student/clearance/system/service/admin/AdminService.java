package com.student.clearance.system.service.admin;

import com.student.clearance.system.domain.admin.Admin;

import java.util.List;
import java.util.Optional;

public interface AdminService {
    List<Admin> getAllAdmins();
    Optional<Admin> getAdminById(Long id);
    Admin addAdmin(Admin admin);
    Admin updateAdmin(Admin admin);
    void deleteAdmin(Long id);
}
