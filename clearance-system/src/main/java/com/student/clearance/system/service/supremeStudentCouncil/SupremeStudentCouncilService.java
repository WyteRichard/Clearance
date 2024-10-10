package com.student.clearance.system.service.supremeStudentCouncil;

import com.student.clearance.system.domain.supremeStudentCouncil.SupremeStudentCouncil;
import java.util.List;

public interface SupremeStudentCouncilService {
    List<SupremeStudentCouncil> getAllSupremeStudentCouncils();
    int getSupremeStudentCouncilCount();
    void deleteSupremeStudentCouncil(Long id);
}
