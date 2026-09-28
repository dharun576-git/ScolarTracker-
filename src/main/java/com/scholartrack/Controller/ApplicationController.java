package com.scholartrack.Controller;

import com.scholartrack.DTO.ApplicationRequest;
import com.scholartrack.Model.Application;
import com.scholartrack.Service.ApplicationService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/applications")
@CrossOrigin
public class ApplicationController {

    private final ApplicationService applicationService;

    public ApplicationController(ApplicationService applicationService) {
        this.applicationService = applicationService;
    }

    @PostMapping
    public ResponseEntity<Application> createApplication(
            @Valid @RequestBody ApplicationRequest request) {

        Application application =
                applicationService.createApplication(
                        request.getStudentId(),
                        request.getSchemeId()
                );

        return ResponseEntity.ok(application);
    }

    @GetMapping
    public ResponseEntity<List<Application>> getAllApplications() {

        return ResponseEntity.ok(
                applicationService.getAllApplications()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<Application> getApplicationById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                applicationService.getApplicationById(id)
        );
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<Application>> getApplicationsByStudent(
            @PathVariable Long studentId) {

        return ResponseEntity.ok(
                applicationService.getApplicationsByStudent(studentId)
        );
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<Application>> getApplicationsByStatus(
            @PathVariable String status) {

        return ResponseEntity.ok(
                applicationService.getApplicationsByStatus(status)
        );
    }
}