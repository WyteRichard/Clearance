package com.student.clearance.system.controller.cashier;

import com.student.clearance.system.domain.cashier.Cashier;
import com.student.clearance.system.service.cashier.CashierService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/Cashier")
public class CashierController {

    private final CashierService cashierService;

    @Autowired
    public CashierController(CashierService cashierService) {
        this.cashierService = cashierService;
    }

    @GetMapping("/cashiers")
    public ResponseEntity<List<Cashier>> getAllCashiers() {
        return new ResponseEntity<>(cashierService.getAllCashiers(), HttpStatus.OK);
    }

    @GetMapping("/cashiers/count")
    public ResponseEntity<Integer> getCashierCount() {
        int count = cashierService.getCashierCount();
        return ResponseEntity.ok(count);
    }

    @DeleteMapping("/cashiers/{id}")
    public ResponseEntity<Void> deleteCashier(@PathVariable Long id) {
        cashierService.deleteCashier(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
