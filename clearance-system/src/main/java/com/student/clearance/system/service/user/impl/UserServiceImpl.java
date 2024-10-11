package com.student.clearance.system.service.user.impl;

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
            boolean isStudentExists = studentRepository.existsByStudentNumberAndEmail(studentNumber, email);
            boolean isUserIdExists = userRepository.existsByUserId(newUser.getStudent().getStudentNumber());
            if (!isStudentExists) {
                throw new PersonExistsException("Student Number Does Not Exist!!");
            } else if (isUserIdExists) {
                throw new PersonExistsException("Student Already Exists!");
            }

            emailService.sendNewPasswordEmail(email, otp);
            user.setUserId(newUser.getStudent().getStudentNumber());
            user.setOtp(otp);
            user.setLocked(true);
            user.setRole(ROLE_STUDENT.name());
            user.setAuthorities(Arrays.stream(ROLE_STUDENT.getAuthorities()).toList());
        } else if (newUser.getSupremeStudentCouncil() != null && newUser.getSupremeStudentCouncil().getSupremeStudentCouncilNumber() != null) {
            String supremeStudentCouncilNumber = newUser.getSupremeStudentCouncil().getSupremeStudentCouncilNumber();
            String email = newUser.getSupremeStudentCouncil().getEmail();
            boolean isSupremeStudentCouncilExists = supremeStudentCouncilRepository.existsBySupremeStudentCouncilNumberAndEmail(supremeStudentCouncilNumber, email);
            boolean isUserIdExists = userRepository.existsByUserId(newUser.getSupremeStudentCouncil().getSupremeStudentCouncilNumber());
            if (!isSupremeStudentCouncilExists) {
                throw new PersonExistsException("SSC Number Does Not Exist!!");
            } else if (isUserIdExists) {
                throw new PersonExistsException("SSC Already Exists!");
            }

            emailService.sendNewPasswordEmail(email, otp);
            user.setUserId(newUser.getSupremeStudentCouncil().getSupremeStudentCouncilNumber());
            user.setOtp(otp);
            user.setLocked(true);
            user.setRole(ROLE_STUDENT_COUNCIL.name());
            user.setAuthorities(Arrays.stream(ROLE_STUDENT_COUNCIL.getAuthorities()).toList());
        } else if (newUser.getStudentAffairs() != null && newUser.getStudentAffairs().getStudentAffairsNumber() != null) {
            String studentAffairsNumber = newUser.getStudentAffairs().getStudentAffairsNumber();
            String email = newUser.getStudentAffairs().getEmail();
            boolean isStudentAffairsExists = studentAffairsRepository.existsByStudentAffairsNumberAndEmail(studentAffairsNumber, email);
            boolean isUserIdExists = userRepository.existsByUserId(newUser.getStudentAffairs().getStudentAffairsNumber());
            if (!isStudentAffairsExists) {
                throw new PersonExistsException("Student Affairs Number Does Not Exist!!");
            } else if (isUserIdExists) {
                throw new PersonExistsException("Student Affairs Already Exists!");
            }

            emailService.sendNewPasswordEmail(email, otp);
            user.setUserId(newUser.getStudentAffairs().getStudentAffairsNumber());
            user.setOtp(otp);
            user.setLocked(true);
            user.setRole(ROLE_STUDENT_AFFAIRS.name());
            user.setAuthorities(Arrays.stream(ROLE_STUDENT_AFFAIRS.getAuthorities()).toList());
        } else if (newUser.getSpiritualAffairs() != null && newUser.getSpiritualAffairs().getSpiritualAffairsNumber() != null) {
            String spiritualAffairsNumber = newUser.getSpiritualAffairs().getSpiritualAffairsNumber();
            String email = newUser.getSpiritualAffairs().getEmail();
            boolean isSpiritualAffairsExists = spiritualAffairsRepository.existsBySpiritualAffairsNumberAndEmail(spiritualAffairsNumber, email);
            boolean isUserIdExists = userRepository.existsByUserId(newUser.getSpiritualAffairs().getSpiritualAffairsNumber());
            if (!isSpiritualAffairsExists) {
                throw new PersonExistsException("Spiritual Affairs Number Does Not Exist!!");
            } else if (isUserIdExists) {
                throw new PersonExistsException("Spiritual Affairs Already Exists!");
            }

            emailService.sendNewPasswordEmail(email, otp);
            user.setUserId(newUser.getSpiritualAffairs().getSpiritualAffairsNumber());
            user.setOtp(otp);
            user.setLocked(true);
            user.setRole(ROLE_SPIRITUAL_AFFAIRS.name());
            user.setAuthorities(Arrays.stream(ROLE_SPIRITUAL_AFFAIRS.getAuthorities()).toList());
        } else if (newUser.getStudentDiscipline() != null && newUser.getStudentDiscipline().getStudentDisciplineNumber() != null) {
            String studentDisciplineNumber = newUser.getStudentDiscipline().getStudentDisciplineNumber();
            String email = newUser.getStudentDiscipline().getEmail();
            boolean isStudentDisciplineExists = studentDisciplineRepository.existsByStudentDisciplineNumberAndEmail(studentDisciplineNumber, email);
            boolean isUserIdExists = userRepository.existsByUserId(newUser.getStudentDiscipline().getStudentDisciplineNumber());
            if (!isStudentDisciplineExists) {
                throw new PersonExistsException("Student Discipline Number Does Not Exist!!");
            } else if (isUserIdExists) {
                throw new PersonExistsException("Student Discipline Already Exists!");
            }

            emailService.sendNewPasswordEmail(email, otp);
            user.setUserId(newUser.getStudentDiscipline().getStudentDisciplineNumber());
            user.setOtp(otp);
            user.setLocked(true);
            user.setRole(ROLE_STUDENT_DISCIPLINE.name());
            user.setAuthorities(Arrays.stream(ROLE_STUDENT_DISCIPLINE.getAuthorities()).toList());
        } else if (newUser.getGuidance() != null && newUser.getGuidance().getGuidanceNumber() != null) {
            String guidanceNumber = newUser.getGuidance().getGuidanceNumber();
            String email = newUser.getGuidance().getEmail();
            boolean isGuidanceExists = guidanceRepository.existsByGuidanceNumberAndEmail(guidanceNumber, email);
            boolean isUserIdExists = userRepository.existsByUserId(newUser.getGuidance().getGuidanceNumber());
            if (!isGuidanceExists) {
                throw new PersonExistsException("Guidance Number Does Not Exist!!");
            } else if (isUserIdExists) {
                throw new PersonExistsException("Guidance Already Exists!");
            }

            emailService.sendNewPasswordEmail(email, otp);
            user.setUserId(newUser.getGuidance().getGuidanceNumber());
            user.setOtp(otp);
            user.setLocked(true);
            user.setRole(ROLE_GUIDANCE.name());
            user.setAuthorities(Arrays.stream(ROLE_GUIDANCE.getAuthorities()).toList());
        } else if (newUser.getLibrary() != null && newUser.getLibrary().getLibraryNumber() != null) {
            String libraryNumber = newUser.getLibrary().getLibraryNumber();
            String email = newUser.getLibrary().getEmail();
            boolean isLibraryExists = libraryRepository.existsByLibraryNumberAndEmail(libraryNumber, email);
            boolean isUserIdExists = userRepository.existsByUserId(newUser.getLibrary().getLibraryNumber());
            if (!isLibraryExists) {
                throw new PersonExistsException("Library Number Does Not Exist!!");
            } else if (isUserIdExists) {
                throw new PersonExistsException("Library Already Exists!");
            }

            emailService.sendNewPasswordEmail(email, otp);
            user.setUserId(newUser.getLibrary().getLibraryNumber());
            user.setOtp(otp);
            user.setLocked(true);
            user.setRole(ROLE_LIBRARY.name());
            user.setAuthorities(Arrays.stream(ROLE_LIBRARY.getAuthorities()).toList());
        } else if (newUser.getLaboratory() != null && newUser.getLaboratory().getLaboratoryNumber() != null) {
            String laboratoryNumber = newUser.getLaboratory().getLaboratoryNumber();
            String email = newUser.getLaboratory().getEmail();
            boolean isLaboratoryExists = laboratoryRepository.existsByLaboratoryNumberAndEmail(laboratoryNumber, email);
            boolean isUserIdExists = userRepository.existsByUserId(newUser.getLaboratory().getLaboratoryNumber());
            if (!isLaboratoryExists) {
                throw new PersonExistsException("Laboratory Number Does Not Exist!!");
            } else if (isUserIdExists) {
                throw new PersonExistsException("Laboratory Already Exists!");
            }

            emailService.sendNewPasswordEmail(email, otp);
            user.setUserId(newUser.getLaboratory().getLaboratoryNumber());
            user.setOtp(otp);
            user.setLocked(true);
            user.setRole(ROLE_LABORATORY.name());
            user.setAuthorities(Arrays.stream(ROLE_LABORATORY.getAuthorities()).toList());
        } else if (newUser.getClinic() != null && newUser.getClinic().getClinicNumber() != null) {
            String clinicNumber = newUser.getClinic().getClinicNumber();
            String email = newUser.getClinic().getEmail();
            boolean isClinicExists = clinicRepository.existsByClinicNumberAndEmail(clinicNumber, email);
            boolean isUserIdExists = userRepository.existsByUserId(newUser.getClinic().getClinicNumber());
            if (!isClinicExists) {
                throw new PersonExistsException("Clinic Number Does Not Exist!!");
            } else if (isUserIdExists) {
                throw new PersonExistsException("Clinic Already Exists!");
            }

            emailService.sendNewPasswordEmail(email, otp);
            user.setUserId(newUser.getClinic().getClinicNumber());
            user.setOtp(otp);
            user.setLocked(true);
            user.setRole(ROLE_CLINIC.name());
            user.setAuthorities(Arrays.stream(ROLE_CLINIC.getAuthorities()).toList());
        } else if (newUser.getCashier() != null && newUser.getCashier().getCashierNumber() != null) {
            String cashierNumber = newUser.getCashier().getCashierNumber();
            String email = newUser.getCashier().getEmail();
            boolean isCashierExists = cashierRepository.existsByCashierNumberAndEmail(cashierNumber, email);
            boolean isUserIdExists = userRepository.existsByUserId(newUser.getCashier().getCashierNumber());
            if (!isCashierExists) {
                throw new PersonExistsException("Cashier Number Does Not Exist!!");
            } else if (isUserIdExists) {
                throw new PersonExistsException("Cashier Already Exists!");
            }

            emailService.sendNewPasswordEmail(email, otp);
            user.setUserId(newUser.getCashier().getCashierNumber());
            user.setOtp(otp);
            user.setLocked(true);
            user.setRole(ROLE_CASHIER.name());
            user.setAuthorities(Arrays.stream(ROLE_CASHIER.getAuthorities()).toList());
        } else if (newUser.getAdviser() != null && newUser.getAdviser().getAdviserNumber() != null) {
            String adviserNumber = newUser.getAdviser().getAdviserNumber();
            String email = newUser.getAdviser().getEmail();
            boolean isAdviserExists = adviserRepository.existsByAdviserNumberAndEmail(adviserNumber, email);
            boolean isUserIdExists = userRepository.existsByUserId(newUser.getAdviser().getAdviserNumber());
            if (!isAdviserExists) {
                throw new PersonExistsException("Adviser Number Does Not Exist!!");
            } else if (isUserIdExists) {
                throw new PersonExistsException("Adviser Already Exists!");
            }

            emailService.sendNewPasswordEmail(email, otp);
            user.setUserId(newUser.getAdviser().getAdviserNumber());
            user.setOtp(otp);
            user.setLocked(true);
            user.setRole(ROLE_ADVISER.name());
            user.setAuthorities(Arrays.stream(ROLE_ADVISER.getAuthorities()).toList());
        } else if (newUser.getClusterCoordinator() != null && newUser.getClusterCoordinator().getClusterCoordinatorNumber() != null) {
            String clusterCoordinatorNumber = newUser.getClusterCoordinator().getClusterCoordinatorNumber();
            String email = newUser.getClusterCoordinator().getEmail();
            boolean isClusterCoordinatorExists = clusterCoordinatorRepository.existsByClusterCoordinatorNumberAndEmail(clusterCoordinatorNumber, email);
            boolean isUserIdExists = userRepository.existsByUserId(newUser.getClusterCoordinator().getClusterCoordinatorNumber());
            if (!isClusterCoordinatorExists) {
                throw new PersonExistsException("Cluster Coordinator Number Does Not Exist!!");
            } else if (isUserIdExists) {
                throw new PersonExistsException("Cluster Coordinator Already Exists!");
            }

            emailService.sendNewPasswordEmail(email, otp);
            user.setUserId(newUser.getClusterCoordinator().getClusterCoordinatorNumber());
            user.setOtp(otp);
            user.setLocked(true);
            user.setRole(ROLE_CLUSTER_COORDINATOR.name());
            user.setAuthorities(Arrays.stream(ROLE_CLUSTER_COORDINATOR.getAuthorities()).toList());
        } else if (newUser.getRegistrar() != null && newUser.getRegistrar().getRegistrarNumber() != null) {
            String registrarNumber = newUser.getRegistrar().getRegistrarNumber();
            String email = newUser.getRegistrar().getEmail();
            boolean isRegistrarExists = registrarRepository.existsByRegistrarNumberAndEmail(registrarNumber, email);
            boolean isUserIdExists = userRepository.existsByUserId(newUser.getRegistrar().getRegistrarNumber());
            if (!isRegistrarExists) {
                throw new PersonExistsException("Registrar Number Does Not Exist!!");
            } else if (isUserIdExists) {
                throw new PersonExistsException("Registrar Already Exists!");
            }

            emailService.sendNewPasswordEmail(email, otp);
            user.setUserId(newUser.getRegistrar().getRegistrarNumber());
            user.setOtp(otp);
            user.setLocked(true);
            user.setRole(ROLE_REGISTRAR.name());
            user.setAuthorities(Arrays.stream(ROLE_REGISTRAR.getAuthorities()).toList());
        } else if (newUser.getDean() != null && newUser.getDean().getDeanNumber() != null) {
            String deanNumber = newUser.getDean().getDeanNumber();
            String email = newUser.getDean().getEmail();
            boolean isDeanExists = deanRepository.existsByDeanNumberAndEmail(deanNumber, email);
            boolean isUserIdExists = userRepository.existsByUserId(newUser.getDean().getDeanNumber());
            if (!isDeanExists) {
                throw new PersonExistsException("Dean Number Does Not Exist!!");
            } else if (isUserIdExists) {
                throw new PersonExistsException("Dean Already Exists!");
            }
            emailService.sendNewPasswordEmail(email, otp);
            user.setUserId(newUser.getDean().getDeanNumber());
            user.setOtp(otp);
            user.setLocked(true);
            user.setRole(ROLE_DEAN.name());
            user.setAuthorities(Arrays.stream(ROLE_DEAN.getAuthorities()).toList());
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
            throw new PersonExistsException("Please create a stronger password. Password should contain special characters.");
        }
    }
    private String generateOTP() {
        return RandomStringUtils.randomAlphanumeric(10);
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
}
