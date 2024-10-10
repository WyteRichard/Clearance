package com.student.clearance.system.domain.clearanceRequest;

import com.student.clearance.system.domain.department.Department;
import com.student.clearance.system.domain.student.Student;
import jakarta.persistence.*;
import lombok.Data;

import java.io.Serializable;

@Entity
@Data
public class ClearanceRequest implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "department_id", nullable = false)
    private Department department;

    @ManyToOne
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @Column(nullable = false)
    private String schoolYear;

    @Column(nullable = false)
    private String semester;

    @Column(nullable = false)
    private Boolean graduating;
}
