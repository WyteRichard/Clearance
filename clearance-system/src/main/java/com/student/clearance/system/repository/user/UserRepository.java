package com.student.clearance.system.repository.user;

import com.student.clearance.system.domain.user.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    User findUserByUsername(String username);
    boolean existsByUserId(String userId);
    boolean existsUserByUsername(String username);

    Optional<User> findByUserId(String userId);
}
