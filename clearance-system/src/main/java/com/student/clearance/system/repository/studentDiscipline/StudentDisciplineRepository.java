package com.student.clearance.system.repository.studentDiscipline;

import com.student.clearance.system.domain.studentDiscipline.StudentDiscipline;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StudentDisciplineRepository extends JpaRepository<StudentDiscipline, Long> {
    boolean existsByStudentDisciplineNumberAndEmail(String studentDisciplineNumber, String email);

    boolean existsByStudentDisciplineNumber(String studentDisciplineNumber);

    StudentDiscipline findByStudentDisciplineNumber(String studentDisciplineNumber);

    List<StudentDiscipline> findBySection_ClusterName(String clusterName);
}
