package com.scholartrack.DTO;

import jakarta.validation.constraints.NotBlank;

public class VerificationRequest {

    @NotBlank(message = "Verifier name is required")
    private String verifierName;

    @NotBlank(message = "Verification status is required")
    private String verificationStatus;

    private String remarks;

    public VerificationRequest() {
    }

    public String getVerifierName() {
        return verifierName;
    }

    public void setVerifierName(String verifierName) {
        this.verifierName = verifierName;
    }

    public String getVerificationStatus() {
        return verificationStatus;
    }

    public void setVerificationStatus(String verificationStatus) {
        this.verificationStatus = verificationStatus;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }
}