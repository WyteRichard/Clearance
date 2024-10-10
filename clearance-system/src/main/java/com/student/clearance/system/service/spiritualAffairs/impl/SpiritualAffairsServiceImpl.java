package com.student.clearance.system.service.spiritualAffairs.impl;


import com.student.clearance.system.domain.spiritualAffairs.SpiritualAffairs;
import com.student.clearance.system.repository.spiritualAffairs.SpiritualAffairsRepository;
import com.student.clearance.system.service.spiritualAffairs.SpiritualAffairsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SpiritualAffairsServiceImpl implements SpiritualAffairsService {

    private final SpiritualAffairsRepository spiritualAffairsRepository;

    @Autowired
    public SpiritualAffairsServiceImpl(SpiritualAffairsRepository spiritualAffairsRepository) {
        this.spiritualAffairsRepository = spiritualAffairsRepository;
    }

    @Override
    public List<SpiritualAffairs> getAllSpiritualAffairs() {
        return spiritualAffairsRepository.findAll();
    }

    @Override
    public int getSpiritualAffairsCount() {
        return (int) spiritualAffairsRepository.count();
    }

    @Override
    public void deleteSpiritualAffairs(Long id) {
        spiritualAffairsRepository.deleteById(id);
    }
}
