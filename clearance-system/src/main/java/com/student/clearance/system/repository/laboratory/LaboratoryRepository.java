package com.student.clearance.system.repository.laboratory;

import com.student.clearance.system.domain.laboratory.Laboratory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LaboratoryRepository extends JpaRepository<Laboratory, Long> {
}
