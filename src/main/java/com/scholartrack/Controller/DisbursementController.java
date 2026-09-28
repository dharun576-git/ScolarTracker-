package com.scholartrack.Controller;

import com.scholartrack.Model.Disbursement;
import com.scholartrack.Service.DisbursementService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/disbursements")
@CrossOrigin
public class DisbursementController {

    private final DisbursementService disbursementService;

    public DisbursementController(
            DisbursementService disbursementService) {

        this.disbursementService = disbursementService;
    }

    @PostMapping("/{applicationId}")
    public ResponseEntity<Disbursement> createDisbursement(
            @PathVariable Long applicationId) {

        return ResponseEntity.ok(
                disbursementService
                        .createDisbursement(applicationId)
        );
    }

    @GetMapping
    public ResponseEntity<List<Disbursement>> getAllDisbursements() {

        return ResponseEntity.ok(
                disbursementService.getAllDisbursements()
        );
    }

    @GetMapping("/application/{applicationId}")
    public ResponseEntity<Disbursement> getDisbursement(
            @PathVariable Long applicationId) {

        return ResponseEntity.ok(
                disbursementService
                        .getDisbursementByApplicationId(applicationId)
        );
    }
}