package com.student.clearance.system.service.dean;

import com.student.clearance.system.domain.dean.Dean;
import java.util.List;

public interface DeanService {
    List<Dean> getAllDeans();
    int getDeanCount();
    void deleteDean(Long id);
}
