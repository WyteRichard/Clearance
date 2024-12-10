package com.student.clearance.system.service.admin.impl;

import com.student.clearance.system.domain.admin.Admin;
import com.student.clearance.system.repository.admin.AdminRepository;
import com.student.clearance.system.service.admin.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AdminServiceImpl implements AdminService {

    private final AdminRepository adminRepository;

    @Autowired
    public AdminServiceImpl(AdminRepository adminRepository) {
        this.adminRepository = adminRepository;
    }

    @Override
    public List<Admin> getAllAdmins() {
        return adminRepository.findAll();
    }

    @Override
    public Optional<Admin> getAdminById(Long id) {
        return adminRepository.findById(id);
    }

    @Override
    public Admin getAdminByAdminNumber(String adminNumber) {
        return adminRepository.findByAdminNumber(adminNumber);
    }

    @Override
    public Admin addAdmin(Admin admin) {
        return adminRepository.save(admin);
    }

    @Override
    public Admin updateAdmin(Admin admin) {
        if (adminRepository.existsById(admin.getId())) {
            return adminRepository.save(admin);
        }
        throw new IllegalArgumentException("Admin not found with id: " + admin.getId());
    }

    @Override
    public void deleteAdmin(Long id) {
        adminRepository.deleteById(id);
    }
}
