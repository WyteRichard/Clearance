package com.student.clearance.system.service.semesterControl.impl;


import com.student.clearance.system.domain.semesterControl.SemesterControl;
import com.student.clearance.system.repository.semesterControl.SemesterControlRepository;
import com.student.clearance.system.service.semesterControl.SemesterControlService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class SemesterControlServiceImpl implements SemesterControlService {

    private final SemesterControlRepository semesterControlRepository;

    @Autowired
    public SemesterControlServiceImpl(SemesterControlRepository semesterControlRepository) {
        this.semesterControlRepository = semesterControlRepository;
    }

    @Override
    public SemesterControl getCurrentSemester() {
        // Assuming there's only one semester control record
        return semesterControlRepository.findById(1L)
                .orElseThrow(() -> new IllegalArgumentException("Semester control record not found"));
    }

    @Override
    public SemesterControl switchSemester(SemesterControl.SemesterType semesterType, String academicYear) {
        // Get or create the semester control record
        SemesterControl semesterControl = semesterControlRepository.findById(1L)
                .orElse(new SemesterControl());

        // Set the new semester and academic year
        semesterControl.setCurrentSemester(semesterType);
        semesterControl.setAcademicYear(academicYear);

        // Save the updated record to the database
        return semesterControlRepository.save(semesterControl);
    }
}