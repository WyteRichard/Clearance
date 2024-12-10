package com.student.clearance.system.service.transactionLog.impl;

import com.student.clearance.system.domain.transactionLog.TransactionLog;
import com.student.clearance.system.repository.transactionLog.TransactionLogRepository;
import com.student.clearance.system.service.transactionLog.TransactionLogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class TransactionLogServiceImpl implements TransactionLogService {

    private final TransactionLogRepository logRepository;

    @Autowired
    public TransactionLogServiceImpl(TransactionLogRepository logRepository) {
        this.logRepository = logRepository;
    }

    @Override
    public void saveLog(TransactionLog log) {
        logRepository.save(log);
    }

    @Override
    public List<TransactionLog> getLogsByStudentIdAndDepartmentId(String studentId, Long departmentId) {
        return logRepository.findByStudentIdAndDepartmentId(studentId, departmentId);
    }

    @Override
    public List<TransactionLog> getLogsByStudentIdAndDepartmentName(String studentId, String departmentName) {
        return logRepository.findByStudentIdAndDepartmentName(studentId, departmentName);
    }

    @Override
    public void saveLogsBatch(List<TransactionLog> logs) {
        logRepository.saveAll(logs);
    }

}
