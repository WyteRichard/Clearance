package com.student.clearance.system.service.student;

import com.student.clearance.system.domain.student.Student;

import java.util.List;
import java.util.Optional;

public interface StudentService {
    List<Student> getAllStudents();
    Optional<Student> getStudentById(Long id);
    Student getStudentByStudentNumber(String studentNumber);
    Student updateStudentByStudentNumber(String studentNumber, Student updatedStudent);
    Student addStudent(Student student);
    void deleteStudentByStudentNumber(String studentNumber);
    int getStudentCount();
}
