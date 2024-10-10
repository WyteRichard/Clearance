package com.student.clearance.system.service.studentAffairs;

import com.student.clearance.system.domain.studentAffairs.StudentAffairs;
import java.util.List;

public interface StudentAffairsService {
    List<StudentAffairs> getAllStudentAffairs();
    int getStudentAffairsCount();
    void deleteStudentAffairs(Long id);
}
