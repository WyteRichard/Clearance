package com.student.clearance.system.repository.yearLevel;

import com.student.clearance.system.domain.yearLevel.YearLevel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface YearLevelRepository extends JpaRepository<YearLevel, Long> {
}
