package com.student.clearance.system.service.semesterControl;


import com.student.clearance.system.domain.semesterControl.SemesterControl;

public interface SemesterControlService {
    SemesterControl getCurrentSemester();
    SemesterControl switchSemester(SemesterControl.SemesterType semesterType, String academicYear);
}
