package com.student.clearance.system.repository.adviser;

import com.student.clearance.system.domain.adviser.Adviser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AdviserRepository extends JpaRepository<Adviser, Long> {
    boolean existsByAdviserNumberAndEmail(String employeeNumber, String email);

    Adviser findByAdviserNumber(String adviserNumber);
}
