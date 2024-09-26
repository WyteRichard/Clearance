package com.student.clearance.system.repository.cashier;

import com.student.clearance.system.domain.cashier.Cashier;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CashierRepository extends JpaRepository<Cashier, Long> {
    boolean existsByCashierNumberAndEmail(String employeeNumber, String email);

    Cashier findByCashierNumber(String cashierNumber);
}

