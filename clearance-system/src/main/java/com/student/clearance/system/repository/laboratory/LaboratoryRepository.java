package com.student.clearance.system.repository.laboratory;

import com.student.clearance.system.domain.course.Course;
import com.student.clearance.system.domain.laboratory.Laboratory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LaboratoryRepository extends JpaRepository<Laboratory, Long> {
    boolean existsByLaboratoryNumberAndEmail(String employeeNumber, String email);

    Laboratory findByLaboratoryNumber(String laboratoryNumber);

    List<Laboratory> findByCourse(Course course);

}
