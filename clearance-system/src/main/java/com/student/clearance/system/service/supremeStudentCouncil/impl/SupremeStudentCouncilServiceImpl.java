package com.student.clearance.system.service.supremeStudentCouncil.impl;

import com.student.clearance.system.domain.supremeStudentCouncil.SupremeStudentCouncil;
import com.student.clearance.system.repository.supremeStudentCouncil.SupremeStudentCouncilRepository;
import com.student.clearance.system.service.supremeStudentCouncil.SupremeStudentCouncilService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SupremeStudentCouncilServiceImpl implements SupremeStudentCouncilService {

    private final SupremeStudentCouncilRepository supremeStudentCouncilRepository;

    @Autowired
    public SupremeStudentCouncilServiceImpl(SupremeStudentCouncilRepository supremeStudentCouncilRepository) {
        this.supremeStudentCouncilRepository = supremeStudentCouncilRepository;
    }

    @Override
    public List<SupremeStudentCouncil> getAllSupremeStudentCouncils() {
        return supremeStudentCouncilRepository.findAll();
    }

    @Override
    public int getSupremeStudentCouncilCount() {
        return (int) supremeStudentCouncilRepository.count();
    }

    @Override
    public void deleteSupremeStudentCouncil(Long id) {
        supremeStudentCouncilRepository.deleteById(id);
    }
}