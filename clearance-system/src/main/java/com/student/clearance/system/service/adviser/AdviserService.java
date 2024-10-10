package com.student.clearance.system.service.adviser;

import com.student.clearance.system.domain.adviser.Adviser;
import java.util.List;

public interface AdviserService {
    List<Adviser> getAllAdvisers();
    int getAdviserCount();
    void deleteAdviser(Long id);
}
