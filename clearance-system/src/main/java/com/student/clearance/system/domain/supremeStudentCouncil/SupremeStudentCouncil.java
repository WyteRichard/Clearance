package com.student.clearance.system.domain.supremeStudentCouncil;

import com.student.clearance.system.domain.department.Department;
import com.student.clearance.system.domain.person.Person;
import com.student.clearance.system.domain.user.User;
import jakarta.persistence.*;
import lombok.Data;

import java.io.Serializable;

@Entity
@Data
public class SupremeStudentCouncil extends Person implements Serializable {

    private Long supremeStudentCouncilId;
    private String supremeStudentCouncilNumber;

    @ManyToOne
    @JoinColumn(name = "department_id")
    private Department department;

    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;
}