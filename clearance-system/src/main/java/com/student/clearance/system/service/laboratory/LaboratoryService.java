package com.student.clearance.system.service.laboratory;

import com.student.clearance.system.domain.laboratory.Laboratory;
import java.util.List;

public interface LaboratoryService {
    List<Laboratory> getAllLaboratories();
    int getLaboratoryCount();
    void deleteLaboratory(Long id);
}
