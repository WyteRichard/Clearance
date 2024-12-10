package com.student.clearance.system.domain.clinic;

import com.student.clearance.system.domain.person.Person;
import com.student.clearance.system.domain.user.User;
import jakarta.persistence.*;
import lombok.Data;

import java.io.Serializable;

@Entity
@Data
public class Clinic extends Person implements Serializable {

    private String clinicNumber;

    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;
}
