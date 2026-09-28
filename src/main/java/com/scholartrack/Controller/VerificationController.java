package com.scholartrack.Controller;

import com.scholartrack.DTO.VerificationRequest;
import com.scholartrack.Model.Verification;
import com.scholartrack.Service.VerificationService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/verifications")
@CrossOrigin
public class VerificationController {

    private final VerificationService verificationService;

    public VerificationController(
            VerificationService verificationService) {

        this.verificationService = verificationService;
    }

    @PutMapping("/{applicationId}")
    public ResponseEntity<Verification> verifyApplication(
            @PathVariable Long applicationId,
            @Valid @RequestBody VerificationRequest request) {

        Verification verification =
                verificationService.verifyApplication(
                        applicationId,
                        request.getVerifierName(),
                        request.getVerificationStatus(),
                        request.getRemarks()
                );

        return ResponseEntity.ok(verification);
    }

    @GetMapping
    public ResponseEntity<List<Verification>> getAllVerifications() {

        return ResponseEntity.ok(
                verificationService.getAllVerifications()
        );
    }

    @GetMapping("/application/{applicationId}")
    public ResponseEntity<Verification> getVerification(
            @PathVariable Long applicationId) {

        return ResponseEntity.ok(
                verificationService
                        .getVerificationByApplicationId(applicationId)
        );
    }
}