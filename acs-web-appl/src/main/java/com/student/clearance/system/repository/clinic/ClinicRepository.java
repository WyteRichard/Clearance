package com.student.clearance.system.repository.clinic;

import com.student.clearance.system.domain.clinic.Clinic;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ClinicRepository extends JpaRepository<Clinic, Long> {
    boolean existsByClinicNumberAndEmail(String clinicNumber, String email);

    boolean existsByClinicNumber(String clinicNumber);

    Clinic findByClinicNumber(String clinicNumber);

}

