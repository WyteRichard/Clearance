package com.student.clearance.system.domain.spiritualAffairs;

import com.student.clearance.system.domain.person.Person;
import com.student.clearance.system.domain.user.User;
import jakarta.persistence.*;
import lombok.Data;

import java.io.Serializable;

@Entity
@Data
public class SpiritualAffairs extends Person implements Serializable {

    private String spiritualAffairsNumber;


    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;
}
