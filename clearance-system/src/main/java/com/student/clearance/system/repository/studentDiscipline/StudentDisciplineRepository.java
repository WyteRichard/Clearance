package com.student.clearance.system.repository.studentDiscipline;

import com.student.clearance.system.domain.studentDiscipline.StudentDiscipline;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StudentDisciplineRepository extends JpaRepository<StudentDiscipline, Long> {
    boolean existsByStudentDisciplineNumberAndEmail(String employeeNumber, String email);

    StudentDiscipline findByStudentDisciplineNumber(String studentDisciplineNumber);
}
