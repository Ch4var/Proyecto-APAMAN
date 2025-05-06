package com.apaman.apaman_backend.repository;

import com.apaman.apaman_backend.model.ObservacionBeneficiario;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ObservacionBeneficiarioRepository
        extends JpaRepository<ObservacionBeneficiario, Long> {

    List<ObservacionBeneficiario> findByBeneficiarioCedula(Integer cedula);
}
