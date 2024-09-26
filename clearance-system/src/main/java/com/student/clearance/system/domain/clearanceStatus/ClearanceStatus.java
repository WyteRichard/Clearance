package com.student.clearance.system.domain.clearanceStatus;

import com.student.clearance.system.domain.clearanceRequest.ClearanceRequest;
import com.student.clearance.system.domain.student.Student;
import jakarta.persistence.*;
import lombok.Data;

import java.io.Serializable;

@Entity
@Data
public class ClearanceStatus implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "clearance_request_id", nullable = false)
    private ClearanceRequest clearanceRequest;

    @ManyToOne
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private Status status;

    private String remarks;

    public enum Status {
        PENDING, CLEARED
    }
}
