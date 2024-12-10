package com.student.clearance.system.domain.semesterControl;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class SemesterControl {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    private SemesterType currentSemester;

    private String academicYear;

    public enum SemesterType {
        FIRST_SEMESTER,
        SECOND_SEMESTER,
        SUMMER
    }
}
