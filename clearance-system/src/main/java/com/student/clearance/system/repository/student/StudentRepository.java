package com.student.clearance.system.repository.student;

import com.student.clearance.system.domain.student.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {
    boolean existsByStudentNumberAndEmail(String studentNumber, String email);

    Student findByStudentNumber(String studentNumber);
}
