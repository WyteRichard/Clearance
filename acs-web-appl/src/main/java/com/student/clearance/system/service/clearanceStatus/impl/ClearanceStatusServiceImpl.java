package com.student.clearance.system.service.clearanceStatus.impl;

import com.student.clearance.system.domain.clearanceStatus.ClearanceStatus;
import com.student.clearance.system.repository.clearanceStatus.ClearanceStatusRepository;
import com.student.clearance.system.service.clearanceStatus.ClearanceStatusService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ClearanceStatusServiceImpl implements ClearanceStatusService {

    private final ClearanceStatusRepository clearanceStatusRepository;

    @Autowired
    public ClearanceStatusServiceImpl(ClearanceStatusRepository clearanceStatusRepository) {
        this.clearanceStatusRepository = clearanceStatusRepository;
    }

    @Override
    public List<ClearanceStatus> getAllClearanceStatuses() {
        return clearanceStatusRepository.findAll();
    }

    @Override
    public Optional<ClearanceStatus> getClearanceStatusById(Long id) {
        return clearanceStatusRepository.findById(id);
    }

    @Override
    public ClearanceStatus addClearanceStatus(ClearanceStatus clearanceStatus) {
        return clearanceStatusRepository.save(clearanceStatus);
    }

    @Override
    public ClearanceStatus updateClearanceStatus(ClearanceStatus clearanceStatus) {
        return clearanceStatusRepository.save(clearanceStatus);
    }

    @Override
    public void deleteClearanceStatus(Long id) {
        clearanceStatusRepository.deleteById(id);
    }

    @Override
    public int countByStudentNumberAndStatus(String studentNumber, ClearanceStatus.Status status) {
        return clearanceStatusRepository.countByStudent_StudentNumberAndStatus(studentNumber, status);
    }

    @Override
    public long countRemarksByStudentNumber(String studentNumber) {
        return clearanceStatusRepository.countByStudent_StudentNumberAndRemarksIsNotNull(studentNumber);
    }

    @Override
    public long countByStatus(ClearanceStatus.Status status) {
        return clearanceStatusRepository.countByStatus(status);
    }

    @Override
    public List<ClearanceStatus> getClearanceStatusesByStudentNumber(String studentNumber) {
        return clearanceStatusRepository.findByStudentNumber(studentNumber);
    }

    @Override
    public int countByDepartmentIdAndStatus(Long departmentId, ClearanceStatus.Status status) {
        return clearanceStatusRepository.countByClearanceRequest_Department_IdAndStatus(departmentId, status);
    }

    @Override
    public int countByDepartmentIdAndCourseAndStatus(Long departmentId, String courseName, ClearanceStatus.Status status) {
        return clearanceStatusRepository.countByDepartmentIdAndCourseAndStatus(departmentId, courseName, status);
    }

    @Override
    public int countByDepartmentIdAndClusterAndStatus(Long departmentId, String clusterName, ClearanceStatus.Status status) {
        return clearanceStatusRepository.countByDepartmentIdAndClusterAndStatus(departmentId, clusterName, status);
    }


}
