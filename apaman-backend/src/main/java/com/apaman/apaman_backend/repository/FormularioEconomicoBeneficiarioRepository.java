package com.apaman.apaman_backend.repository;

import com.apaman.apaman_backend.model.FormularioEconomicoBeneficiario;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface FormularioEconomicoBeneficiarioRepository
        extends JpaRepository<FormularioEconomicoBeneficiario, Long> {

    Optional<FormularioEconomicoBeneficiario> findByBeneficiarioCedula(Integer cedula);
}
