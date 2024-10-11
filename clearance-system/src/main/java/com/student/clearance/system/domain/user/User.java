package com.student.clearance.system.domain.user;

import com.student.clearance.system.domain.adviser.Adviser;
import com.student.clearance.system.domain.cashier.Cashier;
import com.student.clearance.system.domain.clinic.Clinic;
import com.student.clearance.system.domain.clusterCoordinator.ClusterCoordinator;
import com.student.clearance.system.domain.guidance.Guidance;
import com.student.clearance.system.domain.laboratory.Laboratory;
import com.student.clearance.system.domain.library.Library;
import com.student.clearance.system.domain.registrar.Registrar;
import com.student.clearance.system.domain.spiritualAffairs.SpiritualAffairs;
import com.student.clearance.system.domain.student.Student;
import com.student.clearance.system.domain.studentAffairs.StudentAffairs;
import com.student.clearance.system.domain.studentDiscipline.StudentDiscipline;
import com.student.clearance.system.domain.supremeStudentCouncil.SupremeStudentCouncil;
import com.student.clearance.system.domain.dean.Dean;
import com.student.clearance.system.utils.converter.StringListConverter;
import jakarta.persistence.*;
import lombok.Data;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Entity(name = "login")
@Data
public class User implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false, updatable = false)
    private Long id;

    private String userId;
    private String username;
    private String password;
    private Date lastLoginDate;
    private Date joinDate;
    private String role;
    private String otp;

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL)
    private Student student;

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL)
    private SupremeStudentCouncil supremeStudentCouncil;

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL)
    private StudentAffairs studentAffairs;

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL)
    private SpiritualAffairs spiritualAffairs;

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL)
    private StudentDiscipline studentDiscipline;

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL)
    private Guidance guidance;

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL)
    private Library library;

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL)
    private Laboratory laboratory;

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL)
    private Clinic clinic;

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL)
    private Cashier cashier;

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL)
    private Adviser adviser;

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL)
    private ClusterCoordinator clusterCoordinator;

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL)
    private Registrar registrar;

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL)
    private Dean dean;

    @Column(name = "authorities", nullable = false)
    @Convert(converter = StringListConverter.class)
    private List<String> authorities = new ArrayList<>();

    private boolean isActive;
    private boolean isLocked;

}
