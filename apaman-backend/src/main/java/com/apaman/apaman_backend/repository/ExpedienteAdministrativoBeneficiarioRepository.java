package com.apaman.apaman_backend.repository;

import com.apaman.apaman_backend.model.ExpedienteAdministrativoBeneficiario;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ExpedienteAdministrativoBeneficiarioRepository
        extends JpaRepository<ExpedienteAdministrativoBeneficiario, Long> {

    List<ExpedienteAdministrativoBeneficiario> findByBeneficiarioCedula(Integer cedula);
}
