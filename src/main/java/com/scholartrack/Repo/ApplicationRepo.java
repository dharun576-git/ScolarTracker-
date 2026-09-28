package com.scholartrack.Repo;

import com.scholartrack.Model.Application;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ApplicationRepo extends JpaRepository<Application, Long> {

    boolean existsByStudentStudentIdAndSchemeSchemeId(
            Long studentId,
            Long schemeId
    );

    List<Application> findByStudentStudentId(Long studentId);

    List<Application> findByApplicationStatus(String applicationStatus);

    long countByApplicationStatus(String applicationStatus);

    long countByEligibilityStatus(String eligibilityStatus);
}