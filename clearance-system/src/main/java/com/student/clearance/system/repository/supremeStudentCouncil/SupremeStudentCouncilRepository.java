package com.student.clearance.system.repository.supremeStudentCouncil;

import com.student.clearance.system.domain.supremeStudentCouncil.SupremeStudentCouncil;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SupremeStudentCouncilRepository extends JpaRepository<SupremeStudentCouncil, Long> {
}
