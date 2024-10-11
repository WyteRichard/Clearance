package com.student.clearance.system.service.adviser.impl;

import com.student.clearance.system.domain.adviser.Adviser;
import com.student.clearance.system.domain.course.Course;
import com.student.clearance.system.domain.student.Student;
import com.student.clearance.system.repository.adviser.AdviserRepository;
import com.student.clearance.system.service.adviser.AdviserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AdviserServiceImpl implements AdviserService {

    private final AdviserRepository adviserRepository;

    @Autowired
    public AdviserServiceImpl(AdviserRepository adviserRepository) {
        this.adviserRepository = adviserRepository;
    }

    @Override
    public List<Adviser> getAllAdvisers() {
        return adviserRepository.findAll();
    }

    @Override
    public int getAdviserCount() {
        return (int) adviserRepository.count();
    }

    @Override
    public void deleteAdviser(Long id) {
        adviserRepository.deleteById(id);
    }

    @Override
    public Adviser getAdviserByAdviserNumber(String adviserNumber) {
        return adviserRepository.findByAdviserNumber(adviserNumber);
    }

    public List<Adviser> getAdvisersForStudent(Student student) {
        Course studentCourse = student.getCourse();
        return adviserRepository.findByCourse(studentCourse);
    }

}
