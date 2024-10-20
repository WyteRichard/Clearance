package com.student.clearance.system.domain.studentDiscipline;

import com.student.clearance.system.domain.person.Person;
import com.student.clearance.system.domain.section.Section;
import com.student.clearance.system.domain.user.User;
import jakarta.persistence.*;
import lombok.Data;

import java.io.Serializable;

@Entity
@Data
public class StudentDiscipline extends Person implements Serializable {

    private String studentDisciplineNumber;

    @ManyToOne
    @JoinColumn(name = "section_id")
    private Section section;

    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;
}
