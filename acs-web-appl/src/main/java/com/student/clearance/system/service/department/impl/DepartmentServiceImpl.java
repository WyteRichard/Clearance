package com.student.clearance.system.service.department.impl;

import com.student.clearance.system.domain.department.Department;
import com.student.clearance.system.repository.department.DepartmentRepository;
import com.student.clearance.system.service.department.DepartmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DepartmentServiceImpl implements DepartmentService {

    private final DepartmentRepository departmentRepository;

    @Autowired
    public DepartmentServiceImpl(DepartmentRepository departmentRepository) {
        this.departmentRepository = departmentRepository;
    }

    @Override
    public List<Department> getAllDepartments() {
        return departmentRepository.findAll();
    }

    @Override
    public int getDepartmentCount() {
        return (int) departmentRepository.count();
    }
}
