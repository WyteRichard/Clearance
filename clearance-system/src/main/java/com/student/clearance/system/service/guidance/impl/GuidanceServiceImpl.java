package com.student.clearance.system.service.guidance.impl;

import com.student.clearance.system.domain.guidance.Guidance;
import com.student.clearance.system.repository.guidance.GuidanceRepository;
import com.student.clearance.system.service.guidance.GuidanceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GuidanceServiceImpl implements GuidanceService {

    private final GuidanceRepository guidanceRepository;

    @Autowired
    public GuidanceServiceImpl(GuidanceRepository guidanceRepository) {
        this.guidanceRepository = guidanceRepository;
    }

    @Override
    public List<Guidance> getAllGuidances() {
        return guidanceRepository.findAll();
    }

    @Override
    public int getGuidanceCount() {
        return (int) guidanceRepository.count();
    }

    @Override
    public void deleteGuidance(Long id) {
        guidanceRepository.deleteById(id);
    }
}
