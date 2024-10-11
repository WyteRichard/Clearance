package com.student.clearance.system.service.registrar.impl;

import com.student.clearance.system.domain.registrar.Registrar;
import com.student.clearance.system.repository.registrar.RegistrarRepository;
import com.student.clearance.system.service.registrar.RegistrarService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RegistrarServiceImpl implements RegistrarService {

    private final RegistrarRepository registrarRepository;

    @Autowired
    public RegistrarServiceImpl(RegistrarRepository registrarRepository) {
        this.registrarRepository = registrarRepository;
    }

    @Override
    public List<Registrar> getAllRegistrars() {
        return registrarRepository.findAll();
    }

    @Override
    public int getRegistrarCount() {
        return (int) registrarRepository.count();
    }

    @Override
    public void deleteRegistrar(Long id) {
        registrarRepository.deleteById(id);
    }

    @Override
    public Registrar getRegistrarByRegistrarNumber(String registrarNumber) {
        return registrarRepository.findByRegistrarNumber(registrarNumber);
    }
}
