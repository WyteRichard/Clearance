package com.student.clearance.system.repository.student;

import com.student.clearance.system.domain.student.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {
    boolean existsByStudentNumberAndEmail(String studentNumber, String email);

    boolean existsByStudentNumber(String studentNumber);

    Student findByStudentNumber(String studentNumber);

    List<Student> findAllByStudentNumber(String studentNumber);

}
