package com.scholartrack.Repo;

import com.scholartrack.Model.Student;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface StudentRepo extends JpaRepository<Student, Long> {

    boolean existsByEmail(String email);

    Optional<Student> findByEmail(String email);
}