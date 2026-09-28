package com.scholartrack.Service;

import com.scholartrack.Model.Application;
import com.scholartrack.Model.Verification;
import com.scholartrack.Repo.ApplicationRepo;
import com.scholartrack.Repo.VerificationRepo;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class VerificationService {

    private final VerificationRepo verificationRepo;
    private final ApplicationRepo applicationRepo;

    public VerificationService(
            VerificationRepo verificationRepo,
            ApplicationRepo applicationRepo) {

        this.verificationRepo = verificationRepo;
        this.applicationRepo = applicationRepo;
    }

    public Verification verifyApplication(
            Long applicationId,
            String verifierName,
            String verificationStatus,
            String remarks) {

        Application application = applicationRepo.findById(applicationId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Application not found with ID: "
                                        + applicationId));

        if (!"ELIGIBLE".equals(application.getEligibilityStatus())) {

            throw new RuntimeException(
                    "This application is not eligible for verification");
        }

        Verification verification =
                verificationRepo
                        .findByApplicationApplicationId(applicationId)
                        .orElse(new Verification());

        verification.setApplication(application);
        verification.setVerifierName(verifierName);
        verification.setVerificationStatus(verificationStatus);
        verification.setRemarks(remarks);
        verification.setVerifiedAt(LocalDateTime.now());

        if ("APPROVED".equalsIgnoreCase(verificationStatus)) {

            application.setApplicationStatus("VERIFIED");

        } else if ("REJECTED".equalsIgnoreCase(verificationStatus)) {

            application.setApplicationStatus("REJECTED");

        } else {

            application.setApplicationStatus("UNDER_REVIEW");
        }

        applicationRepo.save(application);

        return verificationRepo.save(verification);
    }

    public List<Verification> getAllVerifications() {
        return verificationRepo.findAll();
    }

    public Verification getVerificationByApplicationId(Long applicationId) {

        return verificationRepo
                .findByApplicationApplicationId(applicationId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Verification not found for application: "
                                        + applicationId));
    }
}