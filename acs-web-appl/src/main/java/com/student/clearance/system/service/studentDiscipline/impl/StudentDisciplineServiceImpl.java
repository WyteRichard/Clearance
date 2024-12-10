package com.student.clearance.system.service.studentDiscipline.impl;


import com.student.clearance.system.domain.student.Student;
import com.student.clearance.system.domain.studentDiscipline.StudentDiscipline;
import com.student.clearance.system.repository.studentDiscipline.StudentDisciplineRepository;
import com.student.clearance.system.service.studentDiscipline.StudentDisciplineService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StudentDisciplineServiceImpl implements StudentDisciplineService {

    private final StudentDisciplineRepository studentDisciplineRepository;

    @Autowired
    public StudentDisciplineServiceImpl(StudentDisciplineRepository studentDisciplineRepository) {
        this.studentDisciplineRepository = studentDisciplineRepository;
    }

    @Override
    public List<StudentDiscipline> getAllStudentDisciplines() {
        return studentDisciplineRepository.findAll();
    }

    @Override
    public int getStudentDisciplineCount() {
        return (int) studentDisciplineRepository.count();
    }

    @Override
    public void deleteStudentDiscipline(Long id) {
        studentDisciplineRepository.deleteById(id);
    }

    @Override
    public StudentDiscipline getPrefectByStudentDisciplineNumber(String studentDisciplineNumber) {
        return studentDisciplineRepository.findByStudentDisciplineNumber(studentDisciplineNumber);
    }

    public List<StudentDiscipline> getDisciplinesForStudent(Student student) {
        String studentCluster = student.getSection().getClusterName();
        return studentDisciplineRepository.findBySection_ClusterName(studentCluster);
    }
}
