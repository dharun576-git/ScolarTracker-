package com.scholartrack.Repo;

import com.scholartrack.Model.Verification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface VerificationRepo extends JpaRepository<Verification, Long> {

    Optional<Verification> findByApplicationApplicationId(Long applicationId);

    long countByVerificationStatus(String verificationStatus);
}