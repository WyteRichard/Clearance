package com.student.clearance.system.service.guidance;

import com.student.clearance.system.domain.guidance.Guidance;
import java.util.List;

public interface GuidanceService {
    List<Guidance> getAllGuidances();
    int getGuidanceCount();
    void deleteGuidance(Long id);
}
