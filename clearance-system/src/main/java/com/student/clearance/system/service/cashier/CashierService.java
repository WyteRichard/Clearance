package com.student.clearance.system.service.cashier;

import com.student.clearance.system.domain.cashier.Cashier;
import java.util.List;

public interface CashierService {
    List<Cashier> getAllCashiers();
    int getCashierCount();
    void deleteCashier(Long id);
    Cashier getCashierByCashierNumber(String cashierNumber);
}