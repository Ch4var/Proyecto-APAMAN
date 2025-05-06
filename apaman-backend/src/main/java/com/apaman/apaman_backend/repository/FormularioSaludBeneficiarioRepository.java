package com.apaman.apaman_backend.repository;

import com.apaman.apaman_backend.model.FormularioSaludBeneficiario;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface FormularioSaludBeneficiarioRepository
        extends JpaRepository<FormularioSaludBeneficiario, Long> {

    Optional<FormularioSaludBeneficiario> findByBeneficiarioCedula(Integer cedula);
}
