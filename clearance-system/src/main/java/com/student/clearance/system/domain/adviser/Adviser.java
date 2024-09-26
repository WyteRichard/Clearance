package com.student.clearance.system.domain.adviser;

import com.student.clearance.system.domain.department.Department;
import com.student.clearance.system.domain.person.Person;
import com.student.clearance.system.domain.user.User;
import jakarta.persistence.*;
import jakarta.persistence.OneToOne;
import lombok.Data;

import java.io.Serializable;

@Entity
@Data
public class Adviser extends Person implements Serializable {

    private Long adviserId;
    private String adviserNumber;

    @ManyToOne
    @JoinColumn(name = "department_id")
    private Department department;

    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;

}
