package com.scholartrack.Service;

import com.scholartrack.Model.Application;
import com.scholartrack.Model.Scheme;
import com.scholartrack.Model.Student;
import com.scholartrack.Repo.ApplicationRepo;
import com.scholartrack.Repo.SchemeRepo;
import com.scholartrack.Repo.StudentRepo;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ApplicationService {

    private final ApplicationRepo applicationRepo;
    private final StudentRepo studentRepo;
    private final SchemeRepo schemeRepo;

    public ApplicationService(
            ApplicationRepo applicationRepo,
            StudentRepo studentRepo,
            SchemeRepo schemeRepo) {

        this.applicationRepo = applicationRepo;
        this.studentRepo = studentRepo;
        this.schemeRepo = schemeRepo;
    }

    public Application createApplication(Long studentId, Long schemeId) {

        Student student = studentRepo.findById(studentId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Student not found with ID: " + studentId));

        Scheme scheme = schemeRepo.findById(schemeId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Scheme not found with ID: " + schemeId));

        if (applicationRepo
                .existsByStudentStudentIdAndSchemeSchemeId(studentId, schemeId)) {

            throw new RuntimeException(
                    "Student has already applied for this scholarship");
        }

        Application application = new Application();

        application.setStudent(student);
        application.setScheme(scheme);
        application.setApplicationDate(LocalDateTime.now());

        boolean eligible =
                student.getAnnualIncome() <= scheme.getIncomeLimit()
                        &&
                        student.getMarks() >= scheme.getMinimumMarks();

        if (eligible) {

            application.setEligibilityStatus("ELIGIBLE");
            application.setApplicationStatus("UNDER_REVIEW");
            application.setRemarks(
                    "Student satisfies the basic eligibility criteria");

        } else {

            application.setEligibilityStatus("NOT_ELIGIBLE");
            application.setApplicationStatus("REJECTED");
            application.setRemarks(
                    "Student does not satisfy the scholarship eligibility criteria");
        }

        return applicationRepo.save(application);
    }

    public List<Application> getAllApplications() {
        return applicationRepo.findAll();
    }

    public Application getApplicationById(Long id) {

        return applicationRepo.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Application not found with ID: " + id));
    }

    public List<Application> getApplicationsByStudent(Long studentId) {

        return applicationRepo.findByStudentStudentId(studentId);
    }

    public List<Application> getApplicationsByStatus(String status) {

        return applicationRepo.findByApplicationStatus(status);
    }
}