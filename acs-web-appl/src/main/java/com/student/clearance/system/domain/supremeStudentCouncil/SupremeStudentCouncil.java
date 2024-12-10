package com.student.clearance.system.domain.supremeStudentCouncil;

import com.student.clearance.system.domain.person.Person;
import com.student.clearance.system.domain.user.User;
import jakarta.persistence.*;
import lombok.Data;

import java.io.Serializable;

@Entity
@Data
public class SupremeStudentCouncil extends Person implements Serializable {

    private String supremeStudentCouncilNumber;


    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;
}