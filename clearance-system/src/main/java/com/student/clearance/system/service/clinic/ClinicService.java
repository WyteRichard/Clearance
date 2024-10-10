package com.student.clearance.system.service.clinic;

import com.student.clearance.system.domain.clinic.Clinic;
import java.util.List;

public interface ClinicService {
    List<Clinic> getAllClinics();
    int getClinicCount();
    void deleteClinic(Long id);
}
