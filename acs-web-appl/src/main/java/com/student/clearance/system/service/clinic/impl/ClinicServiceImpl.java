package com.student.clearance.system.service.clinic.impl;

import com.student.clearance.system.domain.clinic.Clinic;
import com.student.clearance.system.repository.clinic.ClinicRepository;
import com.student.clearance.system.service.clinic.ClinicService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ClinicServiceImpl implements ClinicService {

    private final ClinicRepository clinicRepository;

    @Autowired
    public ClinicServiceImpl(ClinicRepository clinicRepository) {
        this.clinicRepository = clinicRepository;
    }

    @Override
    public List<Clinic> getAllClinics() {
        return clinicRepository.findAll();
    }

    @Override
    public int getClinicCount() {
        return (int) clinicRepository.count();
    }

    @Override
    public void deleteClinic(Long id) {
        clinicRepository.deleteById(id);
    }

    @Override
    public Clinic getClinicByClinicNumber(String clinicNumber) {
        return clinicRepository.findByClinicNumber(clinicNumber);
    }
}
