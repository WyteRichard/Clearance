package com.student.clearance.system.service.student;

import com.student.clearance.system.domain.student.Student;

import java.util.List;
import java.util.Optional;

public interface StudentService {
    List<Student> getAllStudents();
    Optional<Student> getStudentById(Long id);
    Student addStudent(Student student);
    Student updateStudent(Student student);
    void deleteStudent(Long id);
    int getStudentCount();
    Student getStudentByStudentNumber(String studentNumber);
}
