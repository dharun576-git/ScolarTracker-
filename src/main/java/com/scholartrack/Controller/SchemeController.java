package com.scholartrack.Controller;

import com.scholartrack.Model.Scheme;
import com.scholartrack.Service.SchemeService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/schemes")
@CrossOrigin
public class SchemeController {

    private final SchemeService schemeService;

    public SchemeController(SchemeService schemeService) {
        this.schemeService = schemeService;
    }

    @PostMapping
    public ResponseEntity<Scheme> createScheme(
            @Valid @RequestBody Scheme scheme) {

        return ResponseEntity.ok(
                schemeService.createScheme(scheme)
        );
    }

    @GetMapping
    public ResponseEntity<List<Scheme>> getAllSchemes() {

        return ResponseEntity.ok(
                schemeService.getAllSchemes()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<Scheme> getSchemeById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                schemeService.getSchemeById(id)
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<Scheme> updateScheme(
            @PathVariable Long id,
            @Valid @RequestBody Scheme scheme) {

        return ResponseEntity.ok(
                schemeService.updateScheme(id, scheme)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteScheme(
            @PathVariable Long id) {

        schemeService.deleteScheme(id);

        return ResponseEntity.ok(
                "Scheme deleted successfully"
        );
    }
}