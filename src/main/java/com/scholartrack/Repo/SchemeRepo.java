package com.scholartrack.Repo;

import com.scholartrack.Model.Scheme;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SchemeRepo extends JpaRepository<Scheme, Long> {

    List<Scheme> findByStatus(String status);
}