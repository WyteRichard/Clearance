package com.student.clearance.system.controller.dashboard;

import com.student.clearance.system.domain.adviser.Adviser;
import com.student.clearance.system.domain.cashier.Cashier;
import com.student.clearance.system.domain.clinic.Clinic;
import com.student.clearance.system.domain.clusterCoordinator.ClusterCoordinator;
import com.student.clearance.system.domain.dean.Dean;
import com.student.clearance.system.domain.guidance.Guidance;
import com.student.clearance.system.domain.laboratory.Laboratory;
import com.student.clearance.system.domain.library.Library;
import com.student.clearance.system.domain.registrar.Registrar;
import com.student.clearance.system.domain.spiritualAffairs.SpiritualAffairs;
import com.student.clearance.system.domain.studentAffairs.StudentAffairs;
import com.student.clearance.system.domain.studentDiscipline.StudentDiscipline;
import com.student.clearance.system.domain.supremeStudentCouncil.SupremeStudentCouncil;

import com.student.clearance.system.service.adviser.AdviserService;
import com.student.clearance.system.service.cashier.CashierService;
import com.student.clearance.system.service.clinic.ClinicService;
import com.student.clearance.system.service.clusterCoordinator.ClusterCoordinatorService;
import com.student.clearance.system.service.dean.DeanService;
import com.student.clearance.system.service.guidance.GuidanceService;
import com.student.clearance.system.service.laboratory.LaboratoryService;
import com.student.clearance.system.service.library.LibraryService;
import com.student.clearance.system.service.registrar.RegistrarService;
import com.student.clearance.system.service.spiritualAffairs.SpiritualAffairsService;
import com.student.clearance.system.service.studentAffairs.StudentAffairsService;
import com.student.clearance.system.service.studentDiscipline.StudentDisciplineService;
import com.student.clearance.system.service.supremeStudentCouncil.SupremeStudentCouncilService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/Dashboard")
public class DashboardController {

    private final AdviserService adviserService;
    private final CashierService cashierService;
    private final ClinicService clinicService;
    private final ClusterCoordinatorService clusterCoordinatorService;
    private final DeanService deanService;
    private final GuidanceService guidanceService;
    private final LaboratoryService laboratoryService;
    private final LibraryService libraryService;
    private final RegistrarService registrarService;
    private final SpiritualAffairsService spiritualAffairsService;
    private final StudentAffairsService studentAffairsService;
    private final StudentDisciplineService studentDisciplineService;
    private final SupremeStudentCouncilService supremeStudentCouncilService;

    @Autowired
    public DashboardController(AdviserService adviserService,
                               CashierService cashierService,
                               ClinicService clinicService,
                               ClusterCoordinatorService clusterCoordinatorService,
                               DeanService deanService,
                               GuidanceService guidanceService,
                               LaboratoryService laboratoryService,
                               LibraryService libraryService,
                               RegistrarService registrarService,
                               SpiritualAffairsService spiritualAffairsService,
                               StudentAffairsService studentAffairsService,
                               StudentDisciplineService studentDisciplineService,
                               SupremeStudentCouncilService supremeStudentCouncilService) {
        this.adviserService = adviserService;
        this.cashierService = cashierService;
        this.clinicService = clinicService;
        this.clusterCoordinatorService = clusterCoordinatorService;
        this.deanService = deanService;
        this.guidanceService = guidanceService;
        this.laboratoryService = laboratoryService;
        this.libraryService = libraryService;
        this.registrarService = registrarService;
        this.spiritualAffairsService = spiritualAffairsService;
        this.studentAffairsService = studentAffairsService;
        this.studentDisciplineService = studentDisciplineService;
        this.supremeStudentCouncilService = supremeStudentCouncilService;
    }

    @GetMapping("/accounts")
    public ResponseEntity<Map<String, List<?>>> getAllAccounts() {
        List<Adviser> advisers = adviserService.getAllAdvisers();
        List<Cashier> cashiers = cashierService.getAllCashiers();
        List<Clinic> clinics = clinicService.getAllClinics();
        List<ClusterCoordinator> clusterCoordinators = clusterCoordinatorService.getAllClusterCoordinators();
        List<Dean> deans = deanService.getAllDeans();
        List<Guidance> guidances = guidanceService.getAllGuidances();
        List<Laboratory> laboratories = laboratoryService.getAllLaboratories();
        List<Library> libraries = libraryService.getAllLibraries();
        List<Registrar> registrars = registrarService.getAllRegistrars();
        List<SpiritualAffairs> spiritualAffairs = spiritualAffairsService.getAllSpiritualAffairs();
        List<StudentAffairs> studentAffairs = studentAffairsService.getAllStudentAffairs();
        List<StudentDiscipline> studentDisciplines = studentDisciplineService.getAllStudentDisciplines();
        List<SupremeStudentCouncil> supremeStudentCouncils = supremeStudentCouncilService.getAllSupremeStudentCouncils();

        Map<String, List<?>> result = new HashMap<>();
        result.put("advisers", advisers);
        result.put("cashiers", cashiers);
        result.put("clinics", clinics);
        result.put("clusterCoordinators", clusterCoordinators);
        result.put("deans", deans);
        result.put("guidances", guidances);
        result.put("laboratories", laboratories);
        result.put("libraries", libraries);
        result.put("registrars", registrars);
        result.put("spiritualAffairs", spiritualAffairs);
        result.put("studentAffairs", studentAffairs);
        result.put("studentDisciplines", studentDisciplines);
        result.put("supremeStudentCouncils", supremeStudentCouncils);

        return new ResponseEntity<>(result, HttpStatus.OK);
    }
}
