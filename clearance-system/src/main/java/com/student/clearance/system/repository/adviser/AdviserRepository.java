package com.student.clearance.system.repository.adviser;

import com.student.clearance.system.domain.adviser.Adviser;
import com.student.clearance.system.domain.course.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AdviserRepository extends JpaRepository<Adviser, Long> {
    List<Adviser> findByCourse(Course course);
}
