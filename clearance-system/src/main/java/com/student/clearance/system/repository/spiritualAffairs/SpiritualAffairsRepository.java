package com.student.clearance.system.repository.spiritualAffairs;

import com.student.clearance.system.domain.spiritualAffairs.SpiritualAffairs;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SpiritualAffairsRepository extends JpaRepository<SpiritualAffairs, Long> {
}
