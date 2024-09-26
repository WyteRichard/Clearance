package com.student.clearance.system.service.student.impl;

import com.student.clearance.system.domain.student.Student;
import com.student.clearance.system.repository.student.StudentRepository;
import com.student.clearance.system.service.student.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class StudentServiceImpl implements StudentService {

    private final StudentRepository studentRepository;

    @Autowired
    public StudentServiceImpl(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    @Override
    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    @Override
    public Optional<Student> getStudentById(Long id) {
        return studentRepository.findById(id);
    }

    @Override
    public Student addStudent(Student student) {
        return studentRepository.save(student);
    }

    @Override
    public Student updateStudent(Student student) {
        return studentRepository.save(student);
    }

    @Override
    public void deleteStudent(Long id) {
        studentRepository.deleteById(id);
    }

    @Override
    public int getStudentCount() {
        return (int) studentRepository.count();
    }

    @Override
    public Student getStudentByStudentNumber(String studentNumber) {
        return studentRepository.findByStudentNumber(studentNumber);
    }
}
