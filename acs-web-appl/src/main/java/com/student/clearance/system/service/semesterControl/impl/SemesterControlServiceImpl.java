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
        return semesterControlRepository.findAll().stream()
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Semester control record not found"));
    }

    @Override
    public SemesterControl switchSemester(SemesterControl.SemesterType semesterType, String academicYear) {
        if (semesterType != SemesterControl.SemesterType.FIRST_SEMESTER &&
                semesterType != SemesterControl.SemesterType.SECOND_SEMESTER &&
                semesterType != SemesterControl.SemesterType.SUMMER) {

            throw new IllegalArgumentException("Invalid semester type");
        }

        SemesterControl semesterControl = semesterControlRepository.findAll().stream()
                .findFirst()
                .orElse(new SemesterControl());

        semesterControl.setCurrentSemester(semesterType);
        semesterControl.setAcademicYear(academicYear);

        return semesterControlRepository.save(semesterControl);
    }
}