package com.student.clearance.system.service.studentDiscipline;


import com.student.clearance.system.domain.studentDiscipline.StudentDiscipline;
import java.util.List;

public interface StudentDisciplineService {
    List<StudentDiscipline> getAllStudentDisciplines();
    int getStudentDisciplineCount();
    void deleteStudentDiscipline(Long id);
    StudentDiscipline getPrefectByStudentDisciplineNumber(String studentDisciplineNumber);
}
