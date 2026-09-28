package com.scholartrack.Model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;

@Entity
@Table(name = "schemes")
public class Scheme {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long schemeId;

    @NotBlank(message = "Scheme name is required")
    private String schemeName;

    private String description;

    @NotNull(message = "Income limit is required")
    @PositiveOrZero(message = "Income limit cannot be negative")
    private Double incomeLimit;

    @NotNull(message = "Minimum marks are required")
    @DecimalMin("0.0")
    @DecimalMax("100.0")
    private Double minimumMarks;

    @NotNull(message = "Scholarship amount is required")
    @Positive(message = "Scholarship amount must be positive")
    private Double scholarshipAmount;

    private String status;

    public Scheme() {
    }

    public Long getSchemeId() {
        return schemeId;
    }

    public void setSchemeId(Long schemeId) {
        this.schemeId = schemeId;
    }

    public String getSchemeName() {
        return schemeName;
    }

    public void setSchemeName(String schemeName) {
        this.schemeName = schemeName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Double getIncomeLimit() {
        return incomeLimit;
    }

    public void setIncomeLimit(Double incomeLimit) {
        this.incomeLimit = incomeLimit;
    }

    public Double getMinimumMarks() {
        return minimumMarks;
    }

    public void setMinimumMarks(Double minimumMarks) {
        this.minimumMarks = minimumMarks;
    }

    public Double getScholarshipAmount() {
        return scholarshipAmount;
    }

    public void setScholarshipAmount(Double scholarshipAmount) {
        this.scholarshipAmount = scholarshipAmount;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}