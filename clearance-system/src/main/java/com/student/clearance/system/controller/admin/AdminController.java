package com.student.clearance.system.controller.admin;

import com.student.clearance.system.domain.admin.Admin;
import com.student.clearance.system.domain.semesterControl.SemesterControl;
import com.student.clearance.system.service.admin.AdminService;
import com.student.clearance.system.service.semesterControl.SemesterControlService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/Admin")
public class AdminController {

    private final AdminService adminService;
    private final SemesterControlService semesterControlService;

    @Autowired
    public AdminController(AdminService adminService, SemesterControlService semesterControlService) {
        this.adminService = adminService;
        this.semesterControlService = semesterControlService;
    }

    @GetMapping("/admins")
    public ResponseEntity<List<Admin>> getAllAdmins() {
        return new ResponseEntity<>(adminService.getAllAdmins(), HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Optional<Admin>> getAdminById(@PathVariable Long id) {
        return new ResponseEntity<>(adminService.getAdminById(id), HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<String> addAdmin(@RequestBody Admin admin) {
        try {
            adminService.addAdmin(admin);
            return new ResponseEntity<>("Admin successfully added", HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>("Admin cannot be added", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<String> updateAdmin(@PathVariable Long id, @RequestBody Admin adminDetails) {
        try {
            Optional<Admin> adminOptional = adminService.getAdminById(id);

            if (adminOptional.isPresent()) {
                Admin admin = adminOptional.get();
                admin.setAdminNumber(adminDetails.getAdminNumber());
                admin.setUser(adminDetails.getUser());

                adminService.updateAdmin(admin);
                return new ResponseEntity<>("Admin successfully updated", HttpStatus.OK);
            } else {
                return new ResponseEntity<>("Admin not found", HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            return new ResponseEntity<>("Admin cannot be updated", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteAdmin(@PathVariable Long id) {
        try {
            Optional<Admin> adminOptional = adminService.getAdminById(id);

            if (adminOptional.isPresent()) {
                adminService.deleteAdmin(id);
                return new ResponseEntity<>("Admin successfully deleted", HttpStatus.NO_CONTENT);
            } else {
                return new ResponseEntity<>("Admin not found", HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            return new ResponseEntity<>("Admin cannot be deleted", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/semester/switch")
    public ResponseEntity<SemesterControl> switchSemester(
            @RequestParam SemesterControl.SemesterType semesterType,
            @RequestParam String academicYear) {
        try {
            SemesterControl updatedSemester = semesterControlService.switchSemester(semesterType, academicYear);
            return new ResponseEntity<>(updatedSemester, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/semester/current")
    public ResponseEntity<SemesterControl> getCurrentSemester() {
        try {
            SemesterControl currentSemester = semesterControlService.getCurrentSemester();
            return new ResponseEntity<>(currentSemester, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
