package com.student.clearance.system.domain.notification;

import com.student.clearance.system.domain.student.Student;
import jakarta.persistence.*;
import lombok.Data;

import java.io.Serializable;
import java.sql.Timestamp;

@Entity
@Data
public class Notification implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long notificationId;

    @ManyToOne
    @JoinColumn(name = "student_id")
    private Student student;

    private String message;
    private Timestamp timestamp;
    private boolean isRead;
}
