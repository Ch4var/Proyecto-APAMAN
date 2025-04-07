package com.apaman.apaman_backend.repository;

import com.apaman.apaman_backend.model.Beneficiario;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BeneficiarioRepository extends JpaRepository<Beneficiario, Long> {
}
