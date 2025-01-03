package com.student.clearance.system.service.user.impl;

import com.student.clearance.system.domain.admin.Admin;
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
import com.student.clearance.system.domain.student.Student;
import com.student.clearance.system.domain.studentAffairs.StudentAffairs;
import com.student.clearance.system.domain.studentDiscipline.StudentDiscipline;
import com.student.clearance.system.domain.supremeStudentCouncil.SupremeStudentCouncil;
import com.student.clearance.system.domain.user.User;
import com.student.clearance.system.domain.user.principal.UserPrincipal;
import com.student.clearance.system.exception.domain.OtpExistsException;
import com.student.clearance.system.exception.domain.PersonExistsException;
import com.student.clearance.system.exception.domain.UserNotFoundException;
import com.student.clearance.system.exception.domain.UsernameExistsException;
import com.student.clearance.system.repository.admin.AdminRepository;
import com.student.clearance.system.repository.adviser.AdviserRepository;
import com.student.clearance.system.repository.cashier.CashierRepository;
import com.student.clearance.system.repository.clinic.ClinicRepository;
import com.student.clearance.system.repository.clusterCoordinator.ClusterCoordinatorRepository;
import com.student.clearance.system.repository.dean.DeanRepository;
import com.student.clearance.system.repository.guidance.GuidanceRepository;
import com.student.clearance.system.repository.laboratory.LaboratoryRepository;
import com.student.clearance.system.repository.library.LibraryRepository;
import com.student.clearance.system.repository.registrar.RegistrarRepository;
import com.student.clearance.system.repository.spiritualAffairs.SpiritualAffairsRepository;
import com.student.clearance.system.repository.student.StudentRepository;
import com.student.clearance.system.repository.studentAffairs.StudentAffairsRepository;
import com.student.clearance.system.repository.studentDiscipline.StudentDisciplineRepository;
import com.student.clearance.system.repository.supremeStudentCouncil.SupremeStudentCouncilRepository;
import com.student.clearance.system.repository.user.UserRepository;
import com.student.clearance.system.service.email.EmailService;
import com.student.clearance.system.service.login.attempt.LoginAttemptService;
import com.student.clearance.system.service.user.UserService;
import jakarta.mail.MessagingException;
import jakarta.transaction.Transactional;
import org.apache.commons.lang3.RandomStringUtils;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.Date;
import java.util.List;

import static com.student.clearance.system.utils.security.enumeration.Role.*;


@Service
@Transactional
@Qualifier("userDetailsService")
public class UserServiceImpl implements UserService, UserDetailsService {

    private final Logger LOGGER = LoggerFactory.getLogger(getClass());
    private UserRepository userRepository;
    private StudentRepository studentRepository;
    private AdminRepository adminRepository;
    private AdviserRepository adviserRepository;
    private CashierRepository cashierRepository;
    private ClinicRepository clinicRepository;
    private ClusterCoordinatorRepository clusterCoordinatorRepository;
    private DeanRepository deanRepository;
    private GuidanceRepository guidanceRepository;
    private LaboratoryRepository laboratoryRepository;
    private LibraryRepository libraryRepository;
    private RegistrarRepository registrarRepository;
    private SpiritualAffairsRepository spiritualAffairsRepository;
    private StudentAffairsRepository studentAffairsRepository;
    private StudentDisciplineRepository studentDisciplineRepository;
    private SupremeStudentCouncilRepository supremeStudentCouncilRepository;
    private BCryptPasswordEncoder passwordEncoder;
    private LoginAttemptService loginAttemptService;

    private EmailService emailService;

    @Autowired
    public UserServiceImpl(UserRepository userRepository,
                           StudentRepository studentRepository,
                           AdminRepository adminRepository,
                           AdviserRepository adviserRepository,
                           CashierRepository cashierRepository,
                           ClinicRepository clinicRepository,
                           ClusterCoordinatorRepository clusterCoordinatorRepository,
                           DeanRepository deanRepository,
                           GuidanceRepository guidanceRepository,
                           LaboratoryRepository laboratoryRepository,
                           LibraryRepository libraryRepository,
                           RegistrarRepository registrarRepository,
                           SpiritualAffairsRepository spiritualAffairsRepository,
                           StudentAffairsRepository studentAffairsRepository,
                           StudentDisciplineRepository studentDisciplineRepository,
                           SupremeStudentCouncilRepository supremeStudentCouncilRepository,
                           BCryptPasswordEncoder passwordEncoder,
                           LoginAttemptService loginAttemptService,
                           EmailService emailService) {
        this.studentRepository = studentRepository;
        this.adminRepository = adminRepository;
        this.adviserRepository = adviserRepository;
        this.cashierRepository = cashierRepository;
        this.clinicRepository = clinicRepository;
        this.clusterCoordinatorRepository = clusterCoordinatorRepository;
        this.deanRepository = deanRepository;
        this.guidanceRepository = guidanceRepository;
        this.laboratoryRepository = laboratoryRepository;
        this.libraryRepository = libraryRepository;
        this.registrarRepository = registrarRepository;
        this.spiritualAffairsRepository = spiritualAffairsRepository;
        this.studentAffairsRepository = studentAffairsRepository;
        this.studentDisciplineRepository = studentDisciplineRepository;
        this.supremeStudentCouncilRepository = supremeStudentCouncilRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.loginAttemptService = loginAttemptService;
        this.emailService = emailService;
    }
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = this.userRepository.findUserByUsername(username);
        if (user == null) {
            LOGGER.error("Username not found...");
            throw new UsernameNotFoundException("Username not found.");
        }
        validateLoginAttempt(user);
        user.setLastLoginDate(new Date());
        this.userRepository.save(user);
        UserPrincipal userPrincipal = new UserPrincipal(user);
        LOGGER.info("User information found...");
        return userPrincipal;
    }
    private void validateLoginAttempt(User user) {
        if(!user.isLocked()) {
            if(loginAttemptService.hasExceededMaxAttempts(user.getUsername())) {
                user.setLocked(true);
            } else {
                user.setLocked(false);
            }
        } else {
            loginAttemptService.evictUserFromLoginAttemptCache(user.getUsername());
        }
    }
    @Override
    public User register(User newUser) throws UsernameNotFoundException, UsernameExistsException, MessagingException, PersonExistsException, UserNotFoundException {
        validateNewUsername(newUser.getUsername());
        validatePassword(newUser.getPassword());
        String otp = generateOTP();
        User user = new User();
        user.setUsername(newUser.getUsername());
        user.setPassword(passwordEncoder.encode(newUser.getPassword()));
        user.setJoinDate(new Date());
        user.setActive(true);

        if (newUser.getStudent() != null && newUser.getStudent().getStudentNumber() != null) {
            String studentNumber = newUser.getStudent().getStudentNumber();
            String email = newUser.getStudent().getEmail();

            boolean isStudentNumberExists = studentRepository.existsByStudentNumber(studentNumber);
            boolean isEmailExistsForStudent = studentRepository.existsByStudentNumberAndEmail(studentNumber, email);
            boolean isUserIdExists = userRepository.existsByUserId(newUser.getStudent().getStudentNumber());
            if (!isStudentNumberExists) {
                throw new PersonExistsException("Student Number Does Not Exist!!");
            }
            if (!isEmailExistsForStudent) {
                throw new PersonExistsException("Email Address Does Not Match the Given Student Number!!");
            }
            if (isUserIdExists) {
                throw new PersonExistsException("Student Already Exists!");
            }
            emailService.sendNewPasswordEmail(email, otp);
            user.setUserId(newUser.getStudent().getStudentNumber());
            user.setOtp(otp);
            user.setLocked(true);
            user.setRole(ROLE_STUDENT.name());
            user.setAuthorities(Arrays.stream(ROLE_STUDENT.getAuthorities()).toList());
        }



        else if (newUser.getSupremeStudentCouncil() != null && newUser.getSupremeStudentCouncil().getSupremeStudentCouncilNumber() != null) {
            String supremeStudentCouncilNumber = newUser.getSupremeStudentCouncil().getSupremeStudentCouncilNumber();
            String email = newUser.getSupremeStudentCouncil().getEmail();

            boolean isSupremeStudentCouncilNumberExists = supremeStudentCouncilRepository.existsBySupremeStudentCouncilNumber(supremeStudentCouncilNumber);
            boolean isEmailExistsForSupremeStudentCouncil = supremeStudentCouncilRepository.existsBySupremeStudentCouncilNumberAndEmail(supremeStudentCouncilNumber, email);
            boolean isUserIdExists = userRepository.existsByUserId(newUser.getSupremeStudentCouncil().getSupremeStudentCouncilNumber());
            if (!isSupremeStudentCouncilNumberExists) {
                throw new PersonExistsException("SSC Number Does Not Exist!!");
            }
            if (!isEmailExistsForSupremeStudentCouncil) {
                throw new PersonExistsException("Email Address Does Not Match the Given SSC Number!!");
            }
            if (isUserIdExists) {
                throw new PersonExistsException("SSC Already Exists!");
            }
            emailService.sendNewPasswordEmail(email, otp);
            user.setUserId(newUser.getSupremeStudentCouncil().getSupremeStudentCouncilNumber());
            user.setOtp(otp);
            user.setLocked(true);
            user.setRole(ROLE_COUNCIL.name());
            user.setAuthorities(Arrays.stream(ROLE_COUNCIL.getAuthorities()).toList());
        }



        else if (newUser.getStudentAffairs() != null && newUser.getStudentAffairs().getStudentAffairsNumber() != null) {
            String studentAffairsNumber = newUser.getStudentAffairs().getStudentAffairsNumber();
            String email = newUser.getStudentAffairs().getEmail();

            boolean isStudentAffairsNumberExists = studentAffairsRepository.existsByStudentAffairsNumber(studentAffairsNumber);
            boolean isEmailExistsForStudentAffairs = studentAffairsRepository.existsByStudentAffairsNumberAndEmail(studentAffairsNumber, email);
            boolean isUserIdExists = userRepository.existsByUserId(newUser.getStudentAffairs().getStudentAffairsNumber());
            if (!isStudentAffairsNumberExists) {
                throw new PersonExistsException("Student Affairs Number Does Not Exist!!");
            }
            if (!isEmailExistsForStudentAffairs) {
                throw new PersonExistsException("Email Address Does Not Match the Given Student Affairs Number!!");
            }
            if (isUserIdExists) {
                throw new PersonExistsException("Student Affairs Already Exists!");
            }
            emailService.sendNewPasswordEmail(email, otp);
            user.setUserId(newUser.getStudentAffairs().getStudentAffairsNumber());
            user.setOtp(otp);
            user.setLocked(true);
            user.setRole(ROLE_AFFAIRS.name());
            user.setAuthorities(Arrays.stream(ROLE_AFFAIRS.getAuthorities()).toList());
        }



        else if (newUser.getSpiritualAffairs() != null && newUser.getSpiritualAffairs().getSpiritualAffairsNumber() != null) {
            String spiritualAffairsNumber = newUser.getSpiritualAffairs().getSpiritualAffairsNumber();
            String email = newUser.getSpiritualAffairs().getEmail();

            boolean isSpiritualAffairsNumberExists = spiritualAffairsRepository.existsBySpiritualAffairsNumber(spiritualAffairsNumber);
            boolean isEmailExistsForSpiritualAffairs = spiritualAffairsRepository.existsBySpiritualAffairsNumberAndEmail(spiritualAffairsNumber, email);
            boolean isUserIdExists = userRepository.existsByUserId(newUser.getSpiritualAffairs().getSpiritualAffairsNumber());
            if (!isSpiritualAffairsNumberExists) {
                throw new PersonExistsException("Spiritual Affairs Number Does Not Exist!!");
            }
            if (!isEmailExistsForSpiritualAffairs) {
                throw new PersonExistsException("Email Address Does Not Match the Given Spiritual Affairs Number!!");
            }
            if (isUserIdExists) {
                throw new PersonExistsException("Spiritual Affairs Already Exists!");
            }
            emailService.sendNewPasswordEmail(email, otp);
            user.setUserId(newUser.getSpiritualAffairs().getSpiritualAffairsNumber());
            user.setOtp(otp);
            user.setLocked(true);
            user.setRole(ROLE_SPIRITUAL.name());
            user.setAuthorities(Arrays.stream(ROLE_SPIRITUAL.getAuthorities()).toList());
        }



        else if (newUser.getStudentDiscipline() != null && newUser.getStudentDiscipline().getStudentDisciplineNumber() != null) {
            String studentDisciplineNumber = newUser.getStudentDiscipline().getStudentDisciplineNumber();
            String email = newUser.getStudentDiscipline().getEmail();

            boolean isStudentDisciplineNumberExists = studentDisciplineRepository.existsByStudentDisciplineNumber(studentDisciplineNumber);
            boolean isEmailExistsForStudentDiscipline = studentDisciplineRepository.existsByStudentDisciplineNumberAndEmail(studentDisciplineNumber, email);
            boolean isUserIdExists = userRepository.existsByUserId(newUser.getStudentDiscipline().getStudentDisciplineNumber());
            if (!isStudentDisciplineNumberExists) {
                throw new PersonExistsException("Student Discipline Number Does Not Exist!!");
            }
            if (!isEmailExistsForStudentDiscipline) {
                throw new PersonExistsException("Email Address Does Not Match the Given Student Discipline Number!!");
            }
            if (isUserIdExists) {
                throw new PersonExistsException("Student Discipline Already Exists!");
            }
            emailService.sendNewPasswordEmail(email, otp);
            user.setUserId(newUser.getStudentDiscipline().getStudentDisciplineNumber());
            user.setOtp(otp);
            user.setLocked(true);
            user.setRole(ROLE_DISCIPLINE.name());
            user.setAuthorities(Arrays.stream(ROLE_DISCIPLINE.getAuthorities()).toList());
        }



        else if (newUser.getGuidance() != null && newUser.getGuidance().getGuidanceNumber() != null) {
            String guidanceNumber = newUser.getGuidance().getGuidanceNumber();
            String email = newUser.getGuidance().getEmail();

            boolean isGuidanceNumberExists = guidanceRepository.existsByGuidanceNumber(guidanceNumber);
            boolean isEmailExistsForGuidance = guidanceRepository.existsByGuidanceNumberAndEmail(guidanceNumber, email);
            boolean isUserIdExists = userRepository.existsByUserId(newUser.getGuidance().getGuidanceNumber());
            if (!isGuidanceNumberExists) {
                throw new PersonExistsException("Guidance Number Does Not Exist!!");
            }
            if (!isEmailExistsForGuidance) {
                throw new PersonExistsException("Email Address Does Not Match the Given Guidance Number!!");
            }
            if (isUserIdExists) {
                throw new PersonExistsException("Guidance Already Exists!");
            }
            emailService.sendNewPasswordEmail(email, otp);
            user.setUserId(newUser.getGuidance().getGuidanceNumber());
            user.setOtp(otp);
            user.setLocked(true);
            user.setRole(ROLE_GUIDANCE.name());
            user.setAuthorities(Arrays.stream(ROLE_GUIDANCE.getAuthorities()).toList());
        }



        else if (newUser.getLibrary() != null && newUser.getLibrary().getLibraryNumber() != null) {
            String libraryNumber = newUser.getLibrary().getLibraryNumber();
            String email = newUser.getLibrary().getEmail();

            boolean isLibraryNumberExists = libraryRepository.existsByLibraryNumber(libraryNumber);
            boolean isEmailExistsForLibrary = libraryRepository.existsByLibraryNumberAndEmail(libraryNumber, email);
            boolean isUserIdExists = userRepository.existsByUserId(newUser.getLibrary().getLibraryNumber());
            if (!isLibraryNumberExists) {
                throw new PersonExistsException("Library Number Does Not Exist!!");
            }
            if (!isEmailExistsForLibrary) {
                throw new PersonExistsException("Email Address Does Not Match the Given Library Number!!");
            }
            if (isUserIdExists) {
                throw new PersonExistsException("Library Already Exists!");
            }
            emailService.sendNewPasswordEmail(email, otp);
            user.setUserId(newUser.getLibrary().getLibraryNumber());
            user.setOtp(otp);
            user.setLocked(true);
            user.setRole(ROLE_LIBRARY.name());
            user.setAuthorities(Arrays.stream(ROLE_LIBRARY.getAuthorities()).toList());
        }



        else if (newUser.getLaboratory() != null && newUser.getLaboratory().getLaboratoryNumber() != null) {
            String laboratoryNumber = newUser.getLaboratory().getLaboratoryNumber();
            String email = newUser.getLaboratory().getEmail();

            boolean isLaboratoryNumberExists = laboratoryRepository.existsByLaboratoryNumber(laboratoryNumber);
            boolean isEmailExistsForLaboratory = laboratoryRepository.existsByLaboratoryNumberAndEmail(laboratoryNumber, email);
            boolean isUserIdExists = userRepository.existsByUserId(newUser.getLaboratory().getLaboratoryNumber());
            if (!isLaboratoryNumberExists) {
                throw new PersonExistsException("Laboratory Number Does Not Exist!!");
            }
            if (!isEmailExistsForLaboratory) {
                throw new PersonExistsException("Email Address Does Not Match the Given Laboratory Number!!");
            }
            if (isUserIdExists) {
                throw new PersonExistsException("Laboratory Already Exists!");
            }
            emailService.sendNewPasswordEmail(email, otp);
            user.setUserId(newUser.getLaboratory().getLaboratoryNumber());
            user.setOtp(otp);
            user.setLocked(true);
            user.setRole(ROLE_LABORATORY.name());
            user.setAuthorities(Arrays.stream(ROLE_LABORATORY.getAuthorities()).toList());
        }



        else if (newUser.getClinic() != null && newUser.getClinic().getClinicNumber() != null) {
            String clinicNumber = newUser.getClinic().getClinicNumber();
            String email = newUser.getClinic().getEmail();

            boolean isClinicNumberExists = clinicRepository.existsByClinicNumber(clinicNumber);
            boolean isEmailExistsForClinic = clinicRepository.existsByClinicNumberAndEmail(clinicNumber, email);
            boolean isUserIdExists = userRepository.existsByUserId(newUser.getClinic().getClinicNumber());
            if (!isClinicNumberExists) {
                throw new PersonExistsException("Clinic Number Does Not Exist!!");
            }
            if (!isEmailExistsForClinic) {
                throw new PersonExistsException("Email Address Does Not Match the Given Clinic Number!!");
            }
            if (isUserIdExists) {
                throw new PersonExistsException("Clinic Already Exists!");
            }
            emailService.sendNewPasswordEmail(email, otp);
            user.setUserId(newUser.getClinic().getClinicNumber());
            user.setOtp(otp);
            user.setLocked(true);
            user.setRole(ROLE_CLINIC.name());
            user.setAuthorities(Arrays.stream(ROLE_CLINIC.getAuthorities()).toList());
        }



        else if (newUser.getCashier() != null && newUser.getCashier().getCashierNumber() != null) {
            String cashierNumber = newUser.getCashier().getCashierNumber();
            String email = newUser.getCashier().getEmail();

            boolean isCashierNumberExists = cashierRepository.existsByCashierNumber(cashierNumber);
            boolean isEmailExistsForCashier = cashierRepository.existsByCashierNumberAndEmail(cashierNumber, email);
            boolean isUserIdExists = userRepository.existsByUserId(newUser.getCashier().getCashierNumber());
            if (!isCashierNumberExists) {
                throw new PersonExistsException("Cashier Number Does Not Exist!!");
            }
            if (!isEmailExistsForCashier) {
                throw new PersonExistsException("Email Address Does Not Match the Given Cashier Number!!");
            }
            if (isUserIdExists) {
                throw new PersonExistsException("Cashier Already Exists!");
            }
            emailService.sendNewPasswordEmail(email, otp);
            user.setUserId(newUser.getCashier().getCashierNumber());
            user.setOtp(otp);
            user.setLocked(true);
            user.setRole(ROLE_CASHIER.name());
            user.setAuthorities(Arrays.stream(ROLE_CASHIER.getAuthorities()).toList());
        }



        else if (newUser.getAdviser() != null && newUser.getAdviser().getAdviserNumber() != null) {
            String adviserNumber = newUser.getAdviser().getAdviserNumber();
            String email = newUser.getAdviser().getEmail();

            boolean isAdviserNumberExists = adviserRepository.existsByAdviserNumber(adviserNumber);
            boolean isEmailExistsForAdviser = adviserRepository.existsByAdviserNumberAndEmail(adviserNumber, email);
            boolean isUserIdExists = userRepository.existsByUserId(newUser.getAdviser().getAdviserNumber());
            if (!isAdviserNumberExists) {
                throw new PersonExistsException("Adviser Number Does Not Exist!!");
            }
            if (!isEmailExistsForAdviser) {
                throw new PersonExistsException("Email Address Does Not Match the Given Adviser Number!!");
            }
            if (isUserIdExists) {
                throw new PersonExistsException("Adviser Already Exists!");
            }
            emailService.sendNewPasswordEmail(email, otp);
            user.setUserId(newUser.getAdviser().getAdviserNumber());
            user.setOtp(otp);
            user.setLocked(true);
            user.setRole(ROLE_ADVISER.name());
            user.setAuthorities(Arrays.stream(ROLE_ADVISER.getAuthorities()).toList());
        }



        else if (newUser.getClusterCoordinator() != null && newUser.getClusterCoordinator().getClusterCoordinatorNumber() != null) {
            String clusterCoordinatorNumber = newUser.getClusterCoordinator().getClusterCoordinatorNumber();
            String email = newUser.getClusterCoordinator().getEmail();

            boolean isClusterCoordinatorNumberExists = clusterCoordinatorRepository.existsByClusterCoordinatorNumber(clusterCoordinatorNumber);
            boolean isEmailExistsForClusterCoordinator = clusterCoordinatorRepository.existsByClusterCoordinatorNumberAndEmail(clusterCoordinatorNumber, email);
            boolean isUserIdExists = userRepository.existsByUserId(newUser.getClusterCoordinator().getClusterCoordinatorNumber());
            if (!isClusterCoordinatorNumberExists) {
                throw new PersonExistsException("Cluster Coordinator Number Does Not Exist!!");
            }
            if (!isEmailExistsForClusterCoordinator) {
                throw new PersonExistsException("Email Address Does Not Match the Given Cluster Coordinator Number!!");
            }
            if (isUserIdExists) {
                throw new PersonExistsException("Cluster Coordinator Already Exists!");
            }
            emailService.sendNewPasswordEmail(email, otp);
            user.setUserId(newUser.getClusterCoordinator().getClusterCoordinatorNumber());
            user.setOtp(otp);
            user.setLocked(true);
            user.setRole(ROLE_COORDINATOR.name());
            user.setAuthorities(Arrays.stream(ROLE_COORDINATOR.getAuthorities()).toList());
        }



        else if (newUser.getRegistrar() != null && newUser.getRegistrar().getRegistrarNumber() != null) {
            String registrarNumber = newUser.getRegistrar().getRegistrarNumber();
            String email = newUser.getRegistrar().getEmail();

            boolean isRegistrarNumberExists = registrarRepository.existsByRegistrarNumber(registrarNumber);
            boolean isEmailExistsForRegistrar = registrarRepository.existsByRegistrarNumberAndEmail(registrarNumber, email);
            boolean isUserIdExists = userRepository.existsByUserId(newUser.getRegistrar().getRegistrarNumber());
            if (!isRegistrarNumberExists) {
                throw new PersonExistsException("Registrar Number Does Not Exist!!");
            }
            if (!isEmailExistsForRegistrar) {
                throw new PersonExistsException("Email Address Does Not Match the Given Registrar Number!!");
            }
            if (isUserIdExists) {
                throw new PersonExistsException("Registrar Already Exists!");
            }
            emailService.sendNewPasswordEmail(email, otp);
            user.setUserId(newUser.getRegistrar().getRegistrarNumber());
            user.setOtp(otp);
            user.setLocked(true);
            user.setRole(ROLE_REGISTRAR.name());
            user.setAuthorities(Arrays.stream(ROLE_REGISTRAR.getAuthorities()).toList());
        }



        else if (newUser.getDean() != null && newUser.getDean().getDeanNumber() != null) {
            String deanNumber = newUser.getDean().getDeanNumber();
            String email = newUser.getDean().getEmail();

            boolean isDeanNumberExists = deanRepository.existsByDeanNumber(deanNumber);
            boolean isEmailExistsForDean = deanRepository.existsByDeanNumberAndEmail(deanNumber, email);
            boolean isUserIdExists = userRepository.existsByUserId(newUser.getDean().getDeanNumber());
            if (!isDeanNumberExists) {
                throw new PersonExistsException("Dean Number Does Not Exist!!");
            }
            if (!isEmailExistsForDean) {
                throw new PersonExistsException("Email Address Does Not Match the Given Dean Number!!");
            }
            if (isUserIdExists) {
                throw new PersonExistsException("Dean Already Exists!");
            }
            emailService.sendNewPasswordEmail(email, otp);
            user.setUserId(newUser.getDean().getDeanNumber());
            user.setOtp(otp);
            user.setLocked(true);
            user.setRole(ROLE_DEAN.name());
            user.setAuthorities(Arrays.stream(ROLE_DEAN.getAuthorities()).toList());
        }



        else if (newUser.getAdmin() != null && newUser.getAdmin().getAdminNumber() != null) {
            String adminNumber = newUser.getAdmin().getAdminNumber();
            String email = newUser.getAdmin().getEmail();

            boolean isAdminNumberExists = adminRepository.existsByAdminNumber(adminNumber);
            boolean isEmailExistsForAdmin = adminRepository.existsByAdminNumberAndEmail(adminNumber, email);
            boolean isUserIdExists = userRepository.existsByUserId(newUser.getAdmin().getAdminNumber());
            if (!isAdminNumberExists) {
                throw new PersonExistsException("Admin Number Does Not Exist!!");
            }
            if (!isEmailExistsForAdmin) {
                throw new PersonExistsException("Email Address Does Not Match the Given Admin Number!!");
            }
            if (isUserIdExists) {
                throw new PersonExistsException("Admin Already Exists!");
            }
            emailService.sendNewPasswordEmail(email, otp);
            user.setUserId(newUser.getAdmin().getAdminNumber());
            user.setOtp(otp);
            user.setLocked(true);
            user.setRole(ROLE_ADMIN.name());
            user.setAuthorities(Arrays.stream(ROLE_ADMIN.getAuthorities()).toList());
        }

            userRepository.save(user);
            LOGGER.info("User registered successfully!");
            return user;
        }

    @Override
    public User forgotPassword(User newUser) throws UsernameNotFoundException, MessagingException {

        String username = newUser.getUsername();
        boolean isUsernameExist = userRepository.existsUserByUsername(username);
        if (isUsernameExist) {
            User user = userRepository.findUserByUsername(username);
            String otp = generateOTP();
            user.setOtp(otp);
            String userNumber = user.getUserId();
            Student studentNumber = studentRepository.findByStudentNumber(userNumber);
            SupremeStudentCouncil supremeStudentCouncilNumber = supremeStudentCouncilRepository.findBySupremeStudentCouncilNumber(userNumber);
            StudentAffairs studentAffairsNumber = studentAffairsRepository.findByStudentAffairsNumber(userNumber);
            SpiritualAffairs spiritualAffairsNumber = spiritualAffairsRepository.findBySpiritualAffairsNumber(userNumber);
            StudentDiscipline studentDisciplineNumber = studentDisciplineRepository.findByStudentDisciplineNumber(userNumber);
            Guidance guidanceNumber = guidanceRepository.findByGuidanceNumber(userNumber);
            Library libraryNumber = libraryRepository.findByLibraryNumber(userNumber);
            Laboratory laboratoryNumber = laboratoryRepository.findByLaboratoryNumber(userNumber);
            Clinic clinicNumber = clinicRepository.findByClinicNumber(userNumber);
            Cashier cashierNumber = cashierRepository.findByCashierNumber(userNumber);
            Adviser adviserNumber = adviserRepository.findByAdviserNumber(userNumber);
            ClusterCoordinator clusterCoordinatorNumber = clusterCoordinatorRepository.findByClusterCoordinatorNumber(userNumber);
            Registrar registrarNumber = registrarRepository.findByRegistrarNumber(userNumber);
            Dean deanNumber = deanRepository.findByDeanNumber(userNumber);
            Admin adminNumber = adminRepository.findByAdminNumber(userNumber);

            if (studentNumber != null) {
                emailService.sendNewPasswordEmail(studentNumber.getEmail(), otp);
            } else if (supremeStudentCouncilNumber != null) {
                emailService.sendNewPasswordEmail(supremeStudentCouncilNumber.getEmail(), otp);
            } else if (studentAffairsNumber != null) {
                emailService.sendNewPasswordEmail(studentAffairsNumber.getEmail(), otp);
            } else if (spiritualAffairsNumber != null) {
                emailService.sendNewPasswordEmail(spiritualAffairsNumber.getEmail(), otp);
            } else if (studentDisciplineNumber != null) {
                emailService.sendNewPasswordEmail(studentDisciplineNumber.getEmail(), otp);
            } else if (guidanceNumber != null) {
                emailService.sendNewPasswordEmail(guidanceNumber.getEmail(), otp);
            } else if (libraryNumber != null) {
                emailService.sendNewPasswordEmail(libraryNumber.getEmail(), otp);
            } else if (laboratoryNumber != null) {
                emailService.sendNewPasswordEmail(laboratoryNumber.getEmail(), otp);
            } else if (clinicNumber != null) {
                emailService.sendNewPasswordEmail(clinicNumber.getEmail(), otp);
            } else if (cashierNumber != null) {
                emailService.sendNewPasswordEmail(cashierNumber.getEmail(), otp);
            } else if (adviserNumber != null) {
                emailService.sendNewPasswordEmail(adviserNumber.getEmail(), otp);
            } else if (clusterCoordinatorNumber != null) {
                emailService.sendNewPasswordEmail(clusterCoordinatorNumber.getEmail(), otp);
            } else if (registrarNumber != null) {
                emailService.sendNewPasswordEmail(registrarNumber.getEmail(), otp);
            } else if (deanNumber != null) {
                emailService.sendNewPasswordEmail(deanNumber.getEmail(), otp);
            } else if (adminNumber != null) {
                emailService.sendNewPasswordEmail(adminNumber.getEmail(), otp);
            }
            userRepository.save(user);
            LOGGER.info("Username Found!");
        } else {
            throw new UsernameNotFoundException("Username Not Found!");
        }
        return newUser;
    }

    @Override
    public List<User> getUsers() {
        return this.userRepository.findAll();
    }

    private void validateNewUsername(String newUsername)
            throws UserNotFoundException, UsernameExistsException, PersonExistsException {
        User userByNewUsername = findUserByUsername(newUsername);
        if (StringUtils.isNotBlank(StringUtils.EMPTY)) {
            User currentUser = findUserByUsername(StringUtils.EMPTY);
            if (currentUser == null) {
                throw new UserNotFoundException("User not found.");
            }
            if (userByNewUsername != null && !userByNewUsername.getId().equals(currentUser.getId())) {
                throw new PersonExistsException("Username already exists.");
            }
        } else {
            if (userByNewUsername != null) {
                throw new PersonExistsException("Username already exists.");
            }
        }
    }
    private void validatePassword(String password) throws PersonExistsException {
        String passwordPattern = ".*[^a-zA-Z0-9].*";
        if (!password.matches(passwordPattern)) {
            throw new PersonExistsException("");
        }
    }
    private String generateOTP() {
        int otp = 100000 + (int) (Math.random() * 900000);
        return String.valueOf(otp);
    }
    private String generateUserId() {
        return RandomStringUtils.randomNumeric(10);
    }

    @Override
    public User findUserByUsername(String username) {
        return this.userRepository.findUserByUsername(username);
    }

    @Override
    public User verifyOtpForgotPassword(User newUser) throws UsernameNotFoundException, PersonExistsException, OtpExistsException {
        validatePassword(newUser.getPassword());
        String username = newUser.getUsername();
        String newPassword = passwordEncoder.encode(newUser.getPassword());
        String otp = newUser.getOtp();
        User user = userRepository.findUserByUsername(username);
        if(user.getOtp().equals(otp)){
            user.setPassword(newPassword);
            user.setOtp(null);
        } else {
            throw new OtpExistsException("Incorrect OTP code!");
        }
        return newUser;
    }

    @Override
    public boolean verifyOtp(String username, String otp) {
        User user = userRepository.findUserByUsername(username);
        if (user != null && user.getOtp().equals(otp)) {
            user.setLocked(false);
            user.setOtp(null);
            userRepository.save(user);
            return true;
        } else {
            return false;
        }
    }

    @Override
    public void deleteUserById(String userId) throws UsernameNotFoundException {
        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new UsernameNotFoundException("User not found."));
        userRepository.delete(user);
        LOGGER.info("User with userId {} deleted successfully.", userId);
    }

    @Override
    public User findUserByUserId(String userId) throws UsernameNotFoundException {
        return userRepository.findByUserId(userId)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with userId: " + userId));
    }

}
