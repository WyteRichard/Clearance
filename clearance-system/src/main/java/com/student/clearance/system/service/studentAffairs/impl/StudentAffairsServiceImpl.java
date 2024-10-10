package com.student.clearance.system.service.studentAffairs.impl;

import com.student.clearance.system.domain.studentAffairs.StudentAffairs;
import com.student.clearance.system.repository.studentAffairs.StudentAffairsRepository;
import com.student.clearance.system.service.studentAffairs.StudentAffairsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StudentAffairsServiceImpl implements StudentAffairsService {

    private final StudentAffairsRepository studentAffairsRepository;

    @Autowired
    public StudentAffairsServiceImpl(StudentAffairsRepository studentAffairsRepository) {
        this.studentAffairsRepository = studentAffairsRepository;
    }

    @Override
    public List<StudentAffairs> getAllStudentAffairs() {
        return studentAffairsRepository.findAll();
    }

    @Override
    public int getStudentAffairsCount() {
        return (int) studentAffairsRepository.count();
    }

    @Override
    public void deleteStudentAffairs(Long id) {
        studentAffairsRepository.deleteById(id);
    }
}