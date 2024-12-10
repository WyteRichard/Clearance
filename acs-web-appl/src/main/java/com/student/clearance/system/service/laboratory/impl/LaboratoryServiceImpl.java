package com.student.clearance.system.service.laboratory.impl;

import com.student.clearance.system.domain.course.Course;
import com.student.clearance.system.domain.laboratory.Laboratory;
import com.student.clearance.system.domain.student.Student;
import com.student.clearance.system.repository.laboratory.LaboratoryRepository;
import com.student.clearance.system.service.laboratory.LaboratoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LaboratoryServiceImpl implements LaboratoryService {

    private final LaboratoryRepository laboratoryRepository;

    @Autowired
    public LaboratoryServiceImpl(LaboratoryRepository laboratoryRepository) {
        this.laboratoryRepository = laboratoryRepository;
    }

    @Override
    public List<Laboratory> getAllLaboratories() {
        return laboratoryRepository.findAll();
    }

    @Override
    public int getLaboratoryCount() {
        return (int) laboratoryRepository.count();
    }

    @Override
    public void deleteLaboratory(Long id) {
        laboratoryRepository.deleteById(id);
    }

    @Override
    public Laboratory getLaboratoryByLaboratoryNumber(String laboratoryNumber) {
        return laboratoryRepository.findByLaboratoryNumber(laboratoryNumber);
    }

    public List<Laboratory> getLaboratoriesForStudent(Student student) {
        Course studentCourse = student.getCourse();
        return laboratoryRepository.findByCourse(studentCourse);
    }
}
