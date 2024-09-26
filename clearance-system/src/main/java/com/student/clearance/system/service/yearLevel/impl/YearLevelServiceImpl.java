package com.student.clearance.system.service.yearLevel.impl;

import com.student.clearance.system.domain.yearLevel.YearLevel;
import com.student.clearance.system.repository.yearLevel.YearLevelRepository;
import com.student.clearance.system.service.yearLevel.YearLevelService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class YearLevelServiceImpl implements YearLevelService {

    private final YearLevelRepository yearLevelRepository;

    @Autowired
    public YearLevelServiceImpl(YearLevelRepository yearLevelRepository) {
        this.yearLevelRepository = yearLevelRepository;
    }

    @Override
    public List<YearLevel> getAllYearLevels() {
        return yearLevelRepository.findAll();
    }

    @Override
    public Optional<YearLevel> getYearLevelById(Long id) {
        return yearLevelRepository.findById(id);
    }

    @Override
    public YearLevel addYearLevel(YearLevel yearLevel) {
        return yearLevelRepository.save(yearLevel);
    }

    @Override
    public YearLevel updateYearLevel(YearLevel yearLevel) {
        return yearLevelRepository.save(yearLevel);
    }

    @Override
    public void deleteYearLevel(Long id) {
        yearLevelRepository.deleteById(id);
    }
}
