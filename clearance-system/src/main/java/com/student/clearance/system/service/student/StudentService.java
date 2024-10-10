package com.student.clearance.system.service.student;

import com.student.clearance.system.domain.student.Student;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

public interface StudentService {
    List<Student> getAllStudents();
    Optional<Student> getStudentById(Long id);
    Student addStudent(Student student);
    void deleteStudent(Long id);
    int getStudentCount();
    Student updateStudent(Long id, Student updatedStudent);

    String saveProfileImage(MultipartFile profileImage);
}
