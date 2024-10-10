package com.student.clearance.system.service.registrar;

import com.student.clearance.system.domain.registrar.Registrar;
import java.util.List;

public interface RegistrarService {
    List<Registrar> getAllRegistrars();
    int getRegistrarCount();
    void deleteRegistrar(Long id);
}
