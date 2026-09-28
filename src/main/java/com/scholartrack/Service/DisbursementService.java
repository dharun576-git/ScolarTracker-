package com.scholartrack.Service;

import com.scholartrack.Model.Application;
import com.scholartrack.Model.Disbursement;
import com.scholartrack.Model.Verification;
import com.scholartrack.Repo.ApplicationRepo;
import com.scholartrack.Repo.DisbursementRepo;
import com.scholartrack.Repo.VerificationRepo;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class DisbursementService {

    private final DisbursementRepo disbursementRepo;
    private final ApplicationRepo applicationRepo;
    private final VerificationRepo verificationRepo;

    public DisbursementService(
            DisbursementRepo disbursementRepo,
            ApplicationRepo applicationRepo,
            VerificationRepo verificationRepo) {

        this.disbursementRepo = disbursementRepo;
        this.applicationRepo = applicationRepo;
        this.verificationRepo = verificationRepo;
    }

    public Disbursement createDisbursement(Long applicationId) {

        Application application = applicationRepo.findById(applicationId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Application not found with ID: "
                                        + applicationId));

        Verification verification =
                verificationRepo
                        .findByApplicationApplicationId(applicationId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Application has not been verified"));

        if (!"APPROVED".equalsIgnoreCase(
                verification.getVerificationStatus())) {

            throw new RuntimeException(
                    "Disbursement cannot be completed before verification approval");
        }

        if (disbursementRepo
                .findByApplicationApplicationId(applicationId)
                .isPresent()) {

            throw new RuntimeException(
                    "Disbursement already exists for this application");
        }

        Disbursement disbursement = new Disbursement();

        disbursement.setApplication(application);

        disbursement.setAmount(
                application.getScheme().getScholarshipAmount());

        disbursement.setDisbursementStatus("COMPLETED");

        disbursement.setDisbursementDate(
                LocalDateTime.now());

        application.setApplicationStatus("DISBURSED");

        applicationRepo.save(application);

        return disbursementRepo.save(disbursement);
    }

    public List<Disbursement> getAllDisbursements() {
        return disbursementRepo.findAll();
    }

    public Disbursement getDisbursementByApplicationId(
            Long applicationId) {

        return disbursementRepo
                .findByApplicationApplicationId(applicationId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Disbursement not found for application: "
                                        + applicationId));
    }
}