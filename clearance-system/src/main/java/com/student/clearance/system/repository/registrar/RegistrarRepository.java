package com.student.clearance.system.repository.registrar;

import com.student.clearance.system.domain.registrar.Registrar;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RegistrarRepository extends JpaRepository<Registrar, Long> {
}
