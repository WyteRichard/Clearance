package com.student.clearance.system.repository.guidance;

import com.student.clearance.system.domain.guidance.Guidance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GuidanceRepository extends JpaRepository<Guidance, Long> {
    boolean existsByGuidanceNumberAndEmail(String guidanceNumber, String email);

    boolean existsByGuidanceNumber(String guidanceNumber);

    Guidance findByGuidanceNumber(String guidanceNumber);
}
