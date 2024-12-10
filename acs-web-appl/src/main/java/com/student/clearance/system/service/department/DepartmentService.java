package com.student.clearance.system.service.department;

import com.student.clearance.system.domain.department.Department;
import java.util.List;

public interface DepartmentService {
    List<Department> getAllDepartments();
    int getDepartmentCount();
}
