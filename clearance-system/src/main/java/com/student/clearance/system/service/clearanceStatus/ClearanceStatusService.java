package com.student.clearance.system.service.clearanceStatus;

import com.student.clearance.system.domain.clearanceStatus.ClearanceStatus;

import java.util.List;
import java.util.Optional;

public interface ClearanceStatusService {
    List<ClearanceStatus> getAllClearanceStatuses();
    Optional<ClearanceStatus> getClearanceStatusById(Long id);
    ClearanceStatus addClearanceStatus(ClearanceStatus clearanceStatus);
    ClearanceStatus updateClearanceStatus(ClearanceStatus clearanceStatus);
    void deleteClearanceStatus(Long id);

    int countByStudentIdAndStatus(Long studentId, ClearanceStatus.Status status);
    long countRemarksByStudentId(Long studentId);
    long countByStatus(ClearanceStatus.Status status);

    List<ClearanceStatus> getClearanceStatusesByStudentId(Long studentId);
}
