package com.student.clearance.system.service.clearanceRequest.impl;

import com.student.clearance.system.domain.clearanceRequest.ClearanceRequest;
import com.student.clearance.system.domain.clearanceStatus.ClearanceStatus;
import com.student.clearance.system.repository.clearanceRequest.ClearanceRequestRepository;
import com.student.clearance.system.repository.clearanceStatus.ClearanceStatusRepository;
import com.student.clearance.system.service.clearanceRequest.ClearanceRequestService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ClearanceRequestServiceImpl implements ClearanceRequestService {

    @Autowired
    private ClearanceRequestRepository clearanceRequestRepository;

    @Autowired
    private ClearanceStatusRepository clearanceStatusRepository;

    @Override
    public List<ClearanceRequest> getAllClearanceRequests() {
        return clearanceRequestRepository.findAll();
    }

    @Override
    public List<ClearanceRequest> getClearanceRequestsByDepartmentAndCourse(Long departmentId, String courseName) {
        return clearanceRequestRepository.findByDepartment_IdAndStudent_Course_CourseName(departmentId, courseName);
    }

    @Override
    public List<ClearanceRequest> getClearanceRequestsByDepartmentAndCluster(Long departmentId, String clusterName) {
        return clearanceRequestRepository.findByDepartment_IdAndStudent_Section_ClusterName(departmentId, clusterName);
    }

    @Override
    public ClearanceRequest getClearanceRequestById(Long id) {
        Optional<ClearanceRequest> clearanceRequest = clearanceRequestRepository.findById(id);
        return clearanceRequest.orElseThrow(() -> new RuntimeException("Clearance request not found with id: " + id));
    }

    @Override
    public List<ClearanceRequest> getClearanceRequestsByStudentName(String name) {
        return clearanceRequestRepository.findByStudent_FirstNameContainingIgnoreCaseOrStudent_MiddleNameContainingIgnoreCaseOrStudent_LastNameContainingIgnoreCase(
                name, name, name);
    }

    @Override
    public List<ClearanceRequest> getClearanceRequestsByStudentId(Long studentId) {
        return clearanceRequestRepository.findByStudent_Id(studentId);
    }

    @Override
    public List<ClearanceRequest> getClearanceRequestsByDepartmentId(Long departmentId) {
        return clearanceRequestRepository.findByDepartment_Id(departmentId);
    }

    @Override
    public long getClearanceRequestCount() {
        return clearanceRequestRepository.count();
    }

    @Override
    public ClearanceRequest createClearanceRequest(ClearanceRequest clearanceRequest) {
        ClearanceRequest savedClearanceRequest = clearanceRequestRepository.save(clearanceRequest);

        // Automatically create ClearanceStatus with status PENDING and null remarks
        ClearanceStatus clearanceStatus = new ClearanceStatus();
        clearanceStatus.setStudent(clearanceRequest.getStudent());  // Assuming the request includes the student
        clearanceStatus.setClearanceRequest(savedClearanceRequest);
        clearanceStatus.setStatus(ClearanceStatus.Status.PENDING);
        clearanceStatus.setRemarks(null);

        clearanceStatusRepository.save(clearanceStatus);

        return savedClearanceRequest;
    }

    @Override
    public ClearanceRequest updateClearanceRequest(Long id, ClearanceRequest clearanceRequest) {
        ClearanceRequest existingClearanceRequest = getClearanceRequestById(id);
        existingClearanceRequest.setDepartment(clearanceRequest.getDepartment());
        existingClearanceRequest.setSchoolYear(clearanceRequest.getSchoolYear());
        existingClearanceRequest.setSemester(clearanceRequest.getSemester());
        existingClearanceRequest.setGraduating(clearanceRequest.getGraduating());
        return clearanceRequestRepository.save(existingClearanceRequest);
    }

    @Override
    public void deleteClearanceRequest(Long id) {
        ClearanceRequest clearanceRequest = getClearanceRequestById(id);
        clearanceRequestRepository.delete(clearanceRequest);
    }

    @Override
    @Transactional
    public void deleteAllClearanceRequestsAndStatusesByStudentNumber(String studentNumber) {
        List<ClearanceRequest> clearanceRequests = clearanceRequestRepository.findByStudent_StudentNumber(studentNumber);
        if (clearanceRequests != null && !clearanceRequests.isEmpty()) {
            for (ClearanceRequest request : clearanceRequests) {
                clearanceStatusRepository.deleteByClearanceRequest(request);
            }
            clearanceRequestRepository.deleteAll(clearanceRequests);
        } else {
            throw new RuntimeException("No clearance requests found for student number: " + studentNumber);
        }
    }

    @Override
    public List<ClearanceRequest> getClearanceRequestsByStudentIdAndDepartmentId(Long studentId, Long departmentId) {
        return clearanceRequestRepository.findByStudentIdAndDepartmentId(studentId, departmentId);
    }

}
