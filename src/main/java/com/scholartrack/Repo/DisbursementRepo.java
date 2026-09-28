package com.scholartrack.Repo;

import com.scholartrack.Model.Disbursement;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface DisbursementRepo extends JpaRepository<Disbursement, Long> {

    Optional<Disbursement> findByApplicationApplicationId(Long applicationId);

    long countByDisbursementStatus(String disbursementStatus);
}