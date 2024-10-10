package com.student.clearance.system.repository.clearanceStatus;

import com.student.clearance.system.domain.clearanceStatus.ClearanceStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ClearanceStatusRepository extends JpaRepository<ClearanceStatus, Long> {

    int countByStudent_IdAndStatus(Long studentId, ClearanceStatus.Status status);
    long countByStudent_IdAndRemarksIsNotNull(Long studentId);
    long countByStatus(ClearanceStatus.Status status);

    @Query("SELECT cs FROM ClearanceStatus cs WHERE cs.student.id = :studentId")
    List<ClearanceStatus> findByStudentId(Long studentId);

    int countByClearanceRequest_Department_IdAndStatus(Long departmentId, ClearanceStatus.Status status);
}
