package com.student.clearance.system.service.dean.impl;

import com.student.clearance.system.domain.dean.Dean;
import com.student.clearance.system.repository.dean.DeanRepository;
import com.student.clearance.system.service.dean.DeanService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DeanServiceImpl implements DeanService {

    private final DeanRepository deanRepository;

    @Autowired
    public DeanServiceImpl(DeanRepository deanRepository) {
        this.deanRepository = deanRepository;
    }

    @Override
    public List<Dean> getAllDeans() {
        return deanRepository.findAll();
    }

    @Override
    public int getDeanCount() {
        return (int) deanRepository.count();
    }

    @Override
    public void deleteDean(Long id) {
        deanRepository.deleteById(id);
    }
}