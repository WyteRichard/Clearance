package com.student.clearance.system.repository.dean;

import com.student.clearance.system.domain.dean.Dean;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DeanRepository extends JpaRepository<Dean, Long> {
    boolean existsByDeanNumberAndEmail(String deanNumber, String email);

    boolean existsByDeanNumber(String deanNumber);

    Dean findByDeanNumber(String deanNumber);
}
