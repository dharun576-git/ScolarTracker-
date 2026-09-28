package com.scholartrack.Service;

import com.scholartrack.Model.Scheme;
import com.scholartrack.Repo.SchemeRepo;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SchemeService {

    private final SchemeRepo schemeRepo;

    public SchemeService(SchemeRepo schemeRepo) {
        this.schemeRepo = schemeRepo;
    }

    public Scheme createScheme(Scheme scheme) {

        if (scheme.getStatus() == null || scheme.getStatus().isBlank()) {
            scheme.setStatus("ACTIVE");
        }

        return schemeRepo.save(scheme);
    }

    public List<Scheme> getAllSchemes() {
        return schemeRepo.findAll();
    }

    public Scheme getSchemeById(Long id) {

        return schemeRepo.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Scheme not found with ID: " + id));
    }

    public Scheme updateScheme(Long id, Scheme updatedScheme) {

        Scheme scheme = getSchemeById(id);

        scheme.setSchemeName(updatedScheme.getSchemeName());
        scheme.setDescription(updatedScheme.getDescription());
        scheme.setIncomeLimit(updatedScheme.getIncomeLimit());
        scheme.setMinimumMarks(updatedScheme.getMinimumMarks());
        scheme.setScholarshipAmount(updatedScheme.getScholarshipAmount());
        scheme.setStatus(updatedScheme.getStatus());

        return schemeRepo.save(scheme);
    }

    public void deleteScheme(Long id) {

        Scheme scheme = getSchemeById(id);

        schemeRepo.delete(scheme);
    }
}