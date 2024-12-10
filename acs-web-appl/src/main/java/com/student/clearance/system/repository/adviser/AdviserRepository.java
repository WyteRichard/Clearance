package com.student.clearance.system.repository.adviser;

import com.student.clearance.system.domain.adviser.Adviser;
import com.student.clearance.system.domain.course.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AdviserRepository extends JpaRepository<Adviser, Long> {
    boolean existsByAdviserNumberAndEmail(String adviserNumber, String email);

    boolean existsByAdviserNumber(String adviserNumber);

    Adviser findByAdviserNumber(String adviserNumber);

    List<Adviser> findByCourse(Course course);
}
