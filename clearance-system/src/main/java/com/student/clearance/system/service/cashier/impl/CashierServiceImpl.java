package com.student.clearance.system.service.cashier.impl;

import com.student.clearance.system.domain.cashier.Cashier;
import com.student.clearance.system.repository.cashier.CashierRepository;
import com.student.clearance.system.service.cashier.CashierService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CashierServiceImpl implements CashierService {

    private final CashierRepository cashierRepository;

    @Autowired
    public CashierServiceImpl(CashierRepository cashierRepository) {
        this.cashierRepository = cashierRepository;
    }

    @Override
    public List<Cashier> getAllCashiers() {
        return cashierRepository.findAll();
    }

    @Override
    public int getCashierCount() {
        return (int) cashierRepository.count();
    }

    @Override
    public void deleteCashier(Long id) {
        cashierRepository.deleteById(id);
    }

    @Override
    public Cashier getCashierByCashierNumber(String cashierNumber) {
        return cashierRepository.findByCashierNumber(cashierNumber);
    }
}
