package com.student.clearance.system.repository.studentAffairs;

import com.student.clearance.system.domain.studentAffairs.StudentAffairs;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StudentAffairsRepository extends JpaRepository<StudentAffairs, Long> {
    boolean existsByStudentAffairsNumberAndEmail(String employeeNumber, String email);

    StudentAffairs findByStudentAffairsNumber(String studentAffairsNumber);
}
