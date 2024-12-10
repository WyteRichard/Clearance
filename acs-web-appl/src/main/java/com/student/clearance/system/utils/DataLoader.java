package com.student.clearance.system.utils;

import com.student.clearance.system.domain.department.Department;
import com.student.clearance.system.repository.department.DepartmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataLoader {

    @Autowired
    private DepartmentRepository departmentRepository;

    @Bean
    public CommandLineRunner loadData() {
        return args -> {
            // Check if departments already exist
            if (departmentRepository.count() == 0) {
                // Add the 13 departments if none exist
                String[] departmentNames = {
                        "Adviser", "Cashier", "Clinic", "Cluster Coordinator", "Dean",
                        "Guidance", "Laboratory", "Library", "Registrar", "Spiritual Affairs",
                        "Student Affairs", "Student Discipline", "Supreme Student Council"
                };

                for (String name : departmentNames) {
                    Department department = new Department();
                    department.setName(name);
                    departmentRepository.save(department);
                }
            }
        };
    }
}
