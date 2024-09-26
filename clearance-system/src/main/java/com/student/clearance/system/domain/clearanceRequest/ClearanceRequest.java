package com.student.clearance.system.domain.clearanceRequest;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import com.student.clearance.system.domain.department.Department;
import com.student.clearance.system.domain.student.Student;
import com.student.clearance.system.domain.clearanceStatus.ClearanceStatus;
import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Entity
@Data
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
public class ClearanceRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "department_id", nullable = false)
    private Department department;

    private String schoolYear;
    private String semester;
    private boolean graduating;

    @ManyToOne
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @OneToMany(mappedBy = "clearanceRequest")
    @JsonManagedReference
    private List<ClearanceStatus> clearanceStatuses;

    public enum Semester {
        FIRST, SECOND
    }
}
