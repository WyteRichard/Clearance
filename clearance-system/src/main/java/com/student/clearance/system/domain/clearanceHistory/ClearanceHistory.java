package com.student.clearance.system.domain.clearanceHistory;

import com.student.clearance.system.domain.adviser.Adviser;
import com.student.clearance.system.domain.cashier.Cashier;
import com.student.clearance.system.domain.clinic.Clinic;
import com.student.clearance.system.domain.clusterCoordinator.ClusterCoordinator;
import com.student.clearance.system.domain.guidance.Guidance;
import com.student.clearance.system.domain.laboratory.Laboratory;
import com.student.clearance.system.domain.library.Library;
import com.student.clearance.system.domain.registrar.Registrar;
import com.student.clearance.system.domain.spiritualAffairs.SpiritualAffairs;
import com.student.clearance.system.domain.studentAffairs.StudentAffairs;
import com.student.clearance.system.domain.studentDiscipline.StudentDiscipline;
import com.student.clearance.system.domain.supremeStudentCouncil.SupremeStudentCouncil;
import com.student.clearance.system.domain.dean.Dean;
import jakarta.persistence.*;
import lombok.Data;

import java.io.Serializable;
import java.sql.Timestamp;

@Entity
@Data
public class ClearanceHistory implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long historyId;

    @ManyToOne
    private SupremeStudentCouncil supremeStudentCouncil;

    @ManyToOne
    private StudentAffairs studentAffairs;

    @ManyToOne
    private SpiritualAffairs spiritualAffairs;

    @ManyToOne
    private StudentDiscipline studentDiscipline;

    @ManyToOne
    private Guidance guidance;

    @ManyToOne
    private Library library;

    @ManyToOne
    private Laboratory laboratory;

    @ManyToOne
    private Clinic clinic;

    @ManyToOne
    private Cashier cashier;

    @ManyToOne
    private Adviser adviser;

    @ManyToOne
    private ClusterCoordinator clusterCoordinator;

    @ManyToOne
    private Registrar registrar;

    @ManyToOne
    private Dean dean;

    private String status;
    private Timestamp timestamp;
    private String remarks;
}
