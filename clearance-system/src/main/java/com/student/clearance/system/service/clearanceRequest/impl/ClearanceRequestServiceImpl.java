package com.student.clearance.system.service.clearanceRequest.impl;

import com.student.clearance.system.domain.clearanceRequest.ClearanceRequest;
import com.student.clearance.system.domain.department.Department;
import com.student.clearance.system.domain.clearanceStatus.ClearanceStatus; // Ensure this import if needed
import com.student.clearance.system.repository.clearanceRequest.ClearanceRequestRepository;
import com.student.clearance.system.service.clearanceRequest.ClearanceRequestService;
import com.student.clearance.system.service.department.DepartmentService;
import com.student.clearance.system.repository.clearanceStatus.ClearanceStatusRepository; // Ensure this import if needed
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ClearanceRequestServiceImpl implements ClearanceRequestService {

    private final ClearanceRequestRepository clearanceRequestRepository;
    private final DepartmentService departmentService;
    private final ClearanceStatusRepository clearanceStatusRepository; // Add repository for ClearanceStatus

    @Autowired
    public ClearanceRequestServiceImpl(ClearanceRequestRepository clearanceRequestRepository,
                                       DepartmentService departmentService,
                                       ClearanceStatusRepository clearanceStatusRepository) {
        this.clearanceRequestRepository = clearanceRequestRepository;
        this.departmentService = departmentService;
        this.clearanceStatusRepository = clearanceStatusRepository; // Initialize ClearanceStatusRepository
    }

    @Override
    public List<ClearanceRequest> getAllClearanceRequests() {
        return clearanceRequestRepository.findAll();
    }

    @Override
    public Optional<ClearanceRequest> getClearanceRequestById(Long id) {
        return clearanceRequestRepository.findById(id);
    }

    @Override
    public ClearanceRequest addClearanceRequest(ClearanceRequest clearanceRequest) {
        return clearanceRequestRepository.save(clearanceRequest);
    }

    @Override
    public ClearanceRequest updateClearanceRequest(ClearanceRequest clearanceRequest) {
        return clearanceRequestRepository.save(clearanceRequest);
    }

    @Override
    public void deleteClearanceRequest(Long id) {
        clearanceRequestRepository.deleteById(id);
    }

    @Override
    public List<ClearanceRequest> getClearanceRequestsByStudentName(String name) {
        return clearanceRequestRepository.findByStudent_FirstNameContainingIgnoreCaseOrStudent_MiddleNameContainingIgnoreCaseOrStudent_LastNameContainingIgnoreCase(name, name, name);
    }

    @Override
    public List<ClearanceRequest> getRequestsByStudentId(Long studentId) {
        return clearanceRequestRepository.findByStudentId(studentId);
    }

    @Override
    public List<ClearanceRequest> getRequestsByDepartmentId(Long departmentId) {
        return clearanceRequestRepository.findByDepartmentId(departmentId);
    }

    @Override
    public List<ClearanceRequest> getRequestsByStudentAndDepartment(Long studentId, Long departmentId) {
        return clearanceRequestRepository.findByStudentIdAndDepartmentId(studentId, departmentId);
    }

    @Override
    public long getClearanceRequestCount() {
        return clearanceRequestRepository.count();
    }

    @Override
    public void addClearanceRequestForAllDepartments(ClearanceRequest clearanceRequest) {
        List<Department> departments = departmentService.getAllDepartments(); // Use departmentService
        for (Department department : departments) {
            ClearanceRequest request = new ClearanceRequest();
            request.setStudent(clearanceRequest.getStudent());
            request.setDepartment(department);
            request.setSemester(clearanceRequest.getSemester());
            request.setSchoolYear(clearanceRequest.getSchoolYear());
            request.setGraduating(clearanceRequest.isGraduating());
            ClearanceRequest savedRequest = clearanceRequestRepository.save(request);

            // Add clearance status for each department
            ClearanceStatus clearanceStatus = new ClearanceStatus();
            clearanceStatus.setClearanceRequest(savedRequest);
            clearanceStatus.setStudent(clearanceRequest.getStudent());
            clearanceStatus.setStatus(ClearanceStatus.Status.PENDING);
            clearanceStatus.setRemarks("NONE");
            clearanceStatusRepository.save(clearanceStatus);
        }
    }

    @Override
    public List<Department> getAllDepartments() {
        return departmentService.getAllDepartments(); // Fetch departments from DepartmentService
    }

    @Override
    public void addClearanceRequestAndStatus(ClearanceRequest clearanceRequest) {

    }
}
