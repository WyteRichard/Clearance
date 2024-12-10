package com.student.clearance.system.service.transactionLog;


import com.student.clearance.system.domain.transactionLog.TransactionLog;

import java.util.List;

public interface TransactionLogService {

    // Method to save a transaction log
    void saveLog(TransactionLog log);

    // Method to retrieve logs by student ID
    List<TransactionLog> getLogsByStudentIdAndDepartmentId(String studentId, Long departmentId);
    List<TransactionLog> getLogsByStudentIdAndDepartmentName(String studentId, String departmentName);

    void saveLogsBatch(List<TransactionLog> logs);

}