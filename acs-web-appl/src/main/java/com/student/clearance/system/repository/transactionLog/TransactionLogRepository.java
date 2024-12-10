package com.student.clearance.system.repository.transactionLog;

import com.student.clearance.system.domain.transactionLog.TransactionLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TransactionLogRepository extends JpaRepository<TransactionLog, Long> {

    // Find all logs by student ID
    List<TransactionLog> findByStudentIdAndDepartmentId(String studentId, Long departmentId);

    @Query("SELECT log FROM TransactionLog log WHERE log.studentId = :studentId AND " +
            "log.departmentId = (SELECT d.id FROM Department d WHERE d.name = :departmentName)")
    List<TransactionLog> findByStudentIdAndDepartmentName(
            @Param("studentId") String studentId, @Param("departmentName") String departmentName);
}
