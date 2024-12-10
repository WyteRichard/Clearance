package com.student.clearance.system.service.clearanceRequest.impl;

import com.student.clearance.system.domain.clearanceRequest.ClearanceRequest;
import com.student.clearance.system.domain.clearanceStatus.ClearanceStatus;
import com.student.clearance.system.domain.department.Department;
import com.student.clearance.system.repository.clearanceRequest.ClearanceRequestRepository;
import com.student.clearance.system.repository.clearanceStatus.ClearanceStatusRepository;
import com.student.clearance.system.repository.department.DepartmentRepository;
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

    @Autowired
    private DepartmentRepository departmentRepository;

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
    public ClearanceRequest updateClearanceRequest(Long id, ClearanceRequest clearanceRequest) {
        ClearanceRequest existingClearanceRequest = getClearanceRequestById(id);
        existingClearanceRequest.setDepartment(clearanceRequest.getDepartment());
        existingClearanceRequest.setSchoolYear(clearanceRequest.getSchoolYear());
        existingClearanceRequest.setSemester(clearanceRequest.getSemester());
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

    @Override
    @Transactional
    public void createClearanceRequestForAllDepartments(ClearanceRequest clearanceRequest) {
        List<Department> departments = departmentRepository.findAll();

        for (Department department : departments) {
            ClearanceRequest requestForDepartment = new ClearanceRequest();
            requestForDepartment.setStudent(clearanceRequest.getStudent());
            requestForDepartment.setDepartment(department);
            requestForDepartment.setSchoolYear(clearanceRequest.getSchoolYear());
            requestForDepartment.setSemester(clearanceRequest.getSemester());

            ClearanceRequest savedRequest = clearanceRequestRepository.save(requestForDepartment);

            ClearanceStatus clearanceStatus = new ClearanceStatus();
            clearanceStatus.setStudent(clearanceRequest.getStudent());
            clearanceStatus.setClearanceRequest(savedRequest);
            clearanceStatus.setStatus(ClearanceStatus.Status.PENDING);
            clearanceStatus.setRemarks(null);

            clearanceStatusRepository.save(clearanceStatus);
        }
    }


    @Override
    public boolean clearanceRequestExistsByStudentId(Long studentId) {
        try {
            System.out.println("Checking if clearance request exists for student ID: " + studentId);
            List<ClearanceRequest> requests = clearanceRequestRepository.findByStudent_Id(studentId);
            System.out.println("Clearance requests found: " + requests.size());
            return !requests.isEmpty();
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    @Override
    public List<ClearanceRequest> getClearanceRequestsByStudentNumber(String studentNumber) {
        return clearanceRequestRepository.findByStudent_StudentNumber(studentNumber);
    }

    @Override
    @Transactional
    public void createClearanceRequestForSelectedDepartments(ClearanceRequest clearanceRequest) {
        List<String> selectedDepartments = List.of(
                "Student Discipline", "Library", "Cashier",
                "Student Affairs", "Dean", "Registrar", "Guidance"
        );

        List<Department> departments = departmentRepository.findAll();
        for (Department department : departments) {
            if (selectedDepartments.contains(department.getName())) {
                ClearanceRequest requestForDepartment = new ClearanceRequest();
                requestForDepartment.setStudent(clearanceRequest.getStudent());
                requestForDepartment.setDepartment(department);
                requestForDepartment.setSchoolYear(clearanceRequest.getSchoolYear());
                requestForDepartment.setSemester(clearanceRequest.getSemester());

                ClearanceRequest savedRequest = clearanceRequestRepository.save(requestForDepartment);

                ClearanceStatus clearanceStatus = new ClearanceStatus();
                clearanceStatus.setStudent(clearanceRequest.getStudent());
                clearanceStatus.setClearanceRequest(savedRequest);
                clearanceStatus.setStatus(ClearanceStatus.Status.PENDING);
                clearanceStatus.setRemarks(null);

                clearanceStatusRepository.save(clearanceStatus);
            }
        }
    }


}
