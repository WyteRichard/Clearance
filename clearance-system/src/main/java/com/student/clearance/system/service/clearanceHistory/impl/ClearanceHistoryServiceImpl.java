package com.student.clearance.system.service.clearanceHistory.impl;

import com.student.clearance.system.domain.clearanceHistory.ClearanceHistory;
import com.student.clearance.system.repository.clearanceHistory.ClearanceHistoryRepository;
import com.student.clearance.system.service.clearanceHistory.ClearanceHistoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ClearanceHistoryServiceImpl implements ClearanceHistoryService {

    private final ClearanceHistoryRepository clearanceHistoryRepository;

    @Autowired
    public ClearanceHistoryServiceImpl(ClearanceHistoryRepository clearanceHistoryRepository) {
        this.clearanceHistoryRepository = clearanceHistoryRepository;
    }

    @Override
    public List<ClearanceHistory> getAllClearanceHistories() {
        return clearanceHistoryRepository.findAll();
    }

    @Override
    public Optional<ClearanceHistory> getClearanceHistoryById(Long id) {
        return clearanceHistoryRepository.findById(id);
    }

    @Override
    public ClearanceHistory addClearanceHistory(ClearanceHistory clearanceHistory) {
        return clearanceHistoryRepository.save(clearanceHistory);
    }

    @Override
    public ClearanceHistory updateClearanceHistory(ClearanceHistory clearanceHistory) {
        return clearanceHistoryRepository.save(clearanceHistory);
    }

    @Override
    public void deleteClearanceHistory(Long id) {
        clearanceHistoryRepository.deleteById(id);
    }
}
