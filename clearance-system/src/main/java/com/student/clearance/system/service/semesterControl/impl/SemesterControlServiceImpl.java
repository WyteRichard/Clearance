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
        // Ensures there is only one record
        return semesterControlRepository.findAll().stream()
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Semester control record not found"));
    }

    @Override
    public SemesterControl switchSemester(SemesterControl.SemesterType semesterType, String academicYear) {
        // Validate that the semesterType is valid
        if (semesterType != SemesterControl.SemesterType.FIRST_SEMESTER &&
                semesterType != SemesterControl.SemesterType.SECOND_SEMESTER &&
                semesterType != SemesterControl.SemesterType.SUMMER) {

            throw new IllegalArgumentException("Invalid semester type");
        }

        // Find the existing record or create a new one if it doesn't exist
        SemesterControl semesterControl = semesterControlRepository.findAll().stream()
                .findFirst()
                .orElse(new SemesterControl());

        // Update the semester and academic year
        semesterControl.setCurrentSemester(semesterType);
        semesterControl.setAcademicYear(academicYear);

        // Save the changes
        return semesterControlRepository.save(semesterControl);
    }
}